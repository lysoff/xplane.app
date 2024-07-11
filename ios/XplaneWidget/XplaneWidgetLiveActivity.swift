//
//  XplaneWidgetLiveActivity.swift
//  XplaneWidget
//
//  Created by Ivan Lysov on 24/06/24.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct XplaneWidgetAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var fields: [String] = []
  }
}

struct XplaneWidgetLiveActivity: Widget {
  var secondaryColor: Color = Color(red: 255/255.0, green: 142/255.0, blue: 1/255.0);
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: XplaneWidgetAttributes.self) { context in
      // Lock screen/banner UI goes here
      VStack {
        ZStack {
          HStack {
            HStack(spacing: 8.0, content: {
              ForEach(context.state.fields, id: \.self) { field in
                Button(intent: ScoreIntent(field: field)) {
                  ZStack {
                    Circle().strokeBorder(secondaryColor, lineWidth: 2).frame(width: 60, height: 60)
                    Image(field)
                      .imageScale(.medium)
                      .foregroundColor(Color(secondaryColor))
                  }
                }
                .buttonStyle(PlainButtonStyle()) // Removes default button styling
                .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
              }

            })
          }
          .padding()
        }
        .padding()
      }
      .activityBackgroundTint(Color.black)
      .activitySystemActionForegroundColor(Color.green)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.center) {
          ZStack {
            HStack {
              HStack(spacing: 8.0, content: {
                ForEach(context.state.fields, id: \.self) { field in
                  Button(intent: ScoreIntent(field: field)) {
                    ZStack {
                      Circle().strokeBorder(secondaryColor, lineWidth: 2)
                      Image(field)
                        .imageScale(.medium)
                        .foregroundColor(.white)
                    }
                  }
                  .buttonStyle(PlainButtonStyle()) // Removes default button styling
                  .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
                }
              })
            }
            .padding()
          }
          .padding()
        }
      } compactLeading: {
        Image(systemName: "xmark")
          .imageScale(.medium)
          .foregroundColor(secondaryColor)
      } compactTrailing: {
        
      } minimal: {
        Image(systemName: "xmark")
          .imageScale(.medium)
          .foregroundColor(secondaryColor)
      }
      .widgetURL(URL(string: "http://www.apple.com"))
      .keylineTint(Color.red)
    }
  }
}

extension XplaneWidgetAttributes {
    fileprivate static var preview: XplaneWidgetAttributes {
        XplaneWidgetAttributes()
    }
}

extension XplaneWidgetAttributes.ContentState {
  fileprivate static var initState: XplaneWidgetAttributes.ContentState {
    XplaneWidgetAttributes.ContentState(fields: ["sugar", "phone"])
  }
}
     

#Preview("Notification", as: .content, using: XplaneWidgetAttributes.preview) {
   XplaneWidgetLiveActivity()
} contentStates: {
    XplaneWidgetAttributes.ContentState.initState
}
