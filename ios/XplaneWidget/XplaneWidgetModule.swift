//
//  XplaneWidgetModule.swift
//  xplaneapp
//
//  Created by Ivan Lysov on 24/06/24.
//
// TimerWidgetModule.swift

import Foundation
import ActivityKit

@objc(XplaneWidgetModule)
class XplaneWidgetModule: NSObject {
  private var currentActivity: Activity<XplaneWidgetAttributes>?
  
  private func areActivitiesEnabled() -> Bool {
    return ActivityAuthorizationInfo().areActivitiesEnabled
  }

  @objc
  func updateLiveActivity(_ array: [String]) -> Void {
    if (!areActivitiesEnabled()) {
      // User disabled Live Activities for the app, nothing to do
      return
    }

    // Preparing data for the Live Activity
    let activityAttributes = XplaneWidgetAttributes()
    let contentState = XplaneWidgetAttributes.ContentState(fields: array)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)

    do {
      // Request to start a new Live Activity with the content defined above
      currentActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
    } catch {
      // Handle errors, skipped for simplicity
    }
  }

  @objc
  func stopLiveActivity() -> Void {
    Task {
      for activity in Activity<XplaneWidgetAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }


//  @objc
//  func pause(_ timestamp: Double) -> Void {
//    pausedAt = Date(timeIntervalSince1970: timestamp)
//    let contentState = XplaneWidgetAttributes.ContentState(startedAt: startedAt, pausedAt: pausedAt)
//    
//    print(pausedAt)
//    print("Pausing")
//    Task {
//      await currentActivity?.update(
//        ActivityContent<XplaneWidgetAttributes.ContentState>(
//          state: contentState,
//          staleDate: nil
//        )
//      )
//    }
//  }
}
