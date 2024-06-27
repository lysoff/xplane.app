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
    // Dynamic stateful properties about your activity go here!
    // Unix timestamp in seconds
    var startedAt: Date?
    var pausedAt: Date?

    func getElapsedTimeInSeconds() -> Int {
      let now = Date()
      guard let startedAt = self.startedAt else {
        return 0
      }
      guard let pausedAt = self.pausedAt else {
        return Int(now.timeIntervalSince1970 - startedAt.timeIntervalSince1970)
      }
      return Int(pausedAt.timeIntervalSince1970 - startedAt.timeIntervalSince1970)
    }

    func getPausedTime() -> String {
      let elapsedTimeInSeconds = getElapsedTimeInSeconds()
      let minutes = (elapsedTimeInSeconds % 3600) / 60
      let seconds = elapsedTimeInSeconds % 60
      return String(format: "%d:%02d", minutes, seconds)
    }

    func getTimeIntervalSinceNow() -> Double {
      guard let startedAt = self.startedAt else {
        return 0
      }
      return startedAt.timeIntervalSince1970 - Date().timeIntervalSince1970
    }

    func isRunning() -> Bool {
      print("isRunning:", pausedAt == nil)
      
      return pausedAt == nil
    }
  }
}

struct XplaneWidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: XplaneWidgetAttributes.self) { context in
      // Lock screen/banner UI goes here
      VStack {
        ZStack {
          RoundedRectangle(cornerRadius: 24).strokeBorder(Color(red: 148/255.0, green: 163/255.0, blue: 184/255.0), lineWidth: 2)
          HStack {
            HStack(spacing: 8.0, content: {
              if (context.state.isRunning()) {
                Button(intent: PauseIntent()) {
                  ZStack {
                    Circle().fill(Color.cyan.opacity(0.5))
                    Image(systemName: "pause.fill")
                      .imageScale(.large)
                      .foregroundColor(.cyan)
                  }
                }
                .buttonStyle(PlainButtonStyle()) // Removes default button styling
                .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
              } else {
                Button(intent: ResumeIntent()) {
                  ZStack {
                    Circle().fill(Color.cyan.opacity(0.5))
                    Image(systemName: "play.fill")
                      .imageScale(.large)
                      .foregroundColor(.cyan)
                  }
                }
                .buttonStyle(PlainButtonStyle()) // Removes default button styling
                .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
              }
              Button(intent: ResetIntent()) {
                ZStack {
                  Circle().fill(.gray.opacity(0.5))
                  Image(systemName: "xmark")
                    .imageScale(.medium)
                    .foregroundColor(.white)
                }
              }
              .buttonStyle(PlainButtonStyle()) // Removes default button styling
              .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
              Spacer()
            })
            if (!context.state.isRunning()) {
              Text(
                context.state.getPausedTime()
              )
              .font(.title)
              .foregroundColor(.cyan)
              .fontWeight(.medium)
              .monospacedDigit()
              .transition(.identity)
            } else {
              Text(
                Date(
                  timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
                ),
                style: .timer
              )
              .font(.title)
              .foregroundColor(.cyan)
              .fontWeight(.medium)
              .monospacedDigit()
              .frame(width: 60)
              .transition(.identity)
            }
          }
          .padding()
        }
        .padding()
      }
      .activityBackgroundTint(Color.cyan)
      .activitySystemActionForegroundColor(Color.black)
    } dynamicIsland: { context in
      DynamicIsland {
        // Expanded Region
        // TimerWidgetLiveActivity.swift
        
        DynamicIslandExpandedRegion(.center) {
          ZStack {
            RoundedRectangle(cornerRadius: 24).strokeBorder(Color(red: 148/255.0, green: 163/255.0, blue: 184/255.0), lineWidth: 2)
            HStack {
              HStack(spacing: 8.0, content: {
                if (context.state.isRunning()) {
                  Button(intent: PauseIntent()) {
                    ZStack {
                      Circle().fill(Color.cyan.opacity(0.5))
                      Image(systemName: "pause.fill")
                        .imageScale(.large)
                        .foregroundColor(.cyan)
                    }
                  }
                  .buttonStyle(PlainButtonStyle()) // Removes default button styling
                  .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
                } else {
                  Button(intent: ResumeIntent()) {
                    ZStack {
                      Circle().fill(Color.cyan.opacity(0.5))
                      Image(systemName: "play.fill")
                        .imageScale(.large)
                        .foregroundColor(.cyan)
                    }
                  }
                  .buttonStyle(PlainButtonStyle()) // Removes default button styling
                  .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
                }
                Button(intent: ResetIntent()) {
                  ZStack {
                    Circle().fill(.gray.opacity(0.5))
                    Image(systemName: "xmark")
                      .imageScale(.medium)
                      .foregroundColor(.white)
                  }
                }
                .buttonStyle(PlainButtonStyle()) // Removes default button styling
                .contentShape(Rectangle()) // Ensures the tap area includes the entire custom content
                Spacer()
              })
              if (!context.state.isRunning()) {
                Text(
                  context.state.getPausedTime()
                )
                .font(.title)
                .foregroundColor(.cyan)
                .fontWeight(.medium)
                .monospacedDigit()
                .transition(.identity)
              } else {
                Text(
                  Date(
                    timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
                  ),
                  style: .timer
                )
                .font(.title)
                .foregroundColor(.cyan)
                .fontWeight(.medium)
                .monospacedDigit()
                .frame(width: 60)
                .transition(.identity)
              }
            }
            .padding()
          }
          .padding()
        }
      } compactLeading: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.cyan)
      } compactTrailing: {
        if (context.state.isRunning()) {
          Text(
            Date(timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()),
            style: .timer
          )
          .font(.title)
          .foregroundColor(.cyan)
          .fontWeight(.medium)
          .monospacedDigit()
        } else {
          Text(
            context.state.getPausedTime()
          )
          .font(.title)
          .foregroundColor(.cyan)
          .fontWeight(.medium)
          .monospacedDigit()
          .transition(.identity)
        }
      } minimal: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.cyan)
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
    XplaneWidgetAttributes.ContentState(startedAt: Date())
  }
}
     

#Preview("Notification", as: .content, using: XplaneWidgetAttributes.preview) {
   XplaneWidgetLiveActivity()
} contentStates: {
    XplaneWidgetAttributes.ContentState.initState
}
