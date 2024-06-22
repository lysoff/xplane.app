//
//  LockScreenMenuLiveActivity.swift
//  LockScreenMenu
//
//  Created by Ivan Lysov on 21/06/24.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct LockScreenMenuAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct LockScreenMenuLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: LockScreenMenuAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension LockScreenMenuAttributes {
    fileprivate static var preview: LockScreenMenuAttributes {
        LockScreenMenuAttributes(name: "World")
    }
}

extension LockScreenMenuAttributes.ContentState {
    fileprivate static var smiley: LockScreenMenuAttributes.ContentState {
        LockScreenMenuAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: LockScreenMenuAttributes.ContentState {
         LockScreenMenuAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: LockScreenMenuAttributes.preview) {
   LockScreenMenuLiveActivity()
} contentStates: {
    LockScreenMenuAttributes.ContentState.smiley
    LockScreenMenuAttributes.ContentState.starEyes
}
