//
//  XplaneWidgetModule.swift
//  xplaneapp
//
//  Created by Ivan Lysov on 24/06/24.
//

import Foundation
import ActivityKit

@objc(XplaneWidgetModule)
class XplaneWidgetModule: NSObject {
  private var currentActivity: Activity<XplaneWidgetAttributes>?
  
  private func areActivitiesEnabled() -> Bool {
    return ActivityAuthorizationInfo().areActivitiesEnabled
  }

  @objc
  func setLiveActivity(_ array: [String]) -> Void {
    if (!areActivitiesEnabled()) {
      // User disabled Live Activities for the app, nothing to do
      return
    }
    
    // Preparing data for the Live Activity
    let activityAttributes = XplaneWidgetAttributes()
    let contentState = XplaneWidgetAttributes.ContentState(fields: array)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)
    
    if (currentActivity == nil) {
      do {
        // Request to start a new Live Activity with the content defined above
        currentActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
      } catch {
        // Handle errors, skipped for simplicity
      }
    } else {
      Task {
        await currentActivity?.update(
          ActivityContent<XplaneWidgetAttributes.ContentState>(
            state: contentState,
            staleDate: nil
          )
        )
      }
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
}
