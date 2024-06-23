//
//  LockScreenMenu.swift
//  LockScreenMenu
//
//  Created by Ivan Lysov on 22/06/24.
//

import WidgetKit
import SwiftUI



struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), buttonName: "placeholder")
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration, buttonName: "snapshot")
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []

      let buttonName = UserDefaults(suiteName:"group.xplaneapp")!.string(forKey: "buttonname") ?? "Default"
        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
      
      
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, configuration: configuration, buttonName: buttonName)
            entries.append(entry)
        }

        return Timeline(entries: entries, policy: .atEnd)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let buttonName: String
}

struct LockScreenMenuEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack {
           Text(entry.buttonName)
        }
    }
}

struct LockScreenMenu: Widget {
    let kind: String = "LockScreenMenu"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            LockScreenMenuEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .supportedFamilies([.accessoryRectangular, .accessoryCircular, .accessoryInline])
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .accessoryRectangular) {
    LockScreenMenu()
} timeline: {
    SimpleEntry(date: .now, configuration: .smiley, buttonName: "preview test")
  SimpleEntry(date: .now, configuration: .starEyes, buttonName: "preview test")
}
