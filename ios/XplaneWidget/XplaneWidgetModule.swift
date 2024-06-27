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
  private var startedAt: Date?
  private var pausedAt: Date?

  private func areActivitiesEnabled() -> Bool {
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }

    @objc
    func startLiveActivity(_ timestamp: Double) -> Void {
      startedAt = Date(timeIntervalSince1970: timestamp)
      if (!areActivitiesEnabled()) {
        // User disabled Live Activities for the app, nothing to do
        return
      }

      // Preparing data for the Live Activity
      let activityAttributes = XplaneWidgetAttributes()
      let contentState = XplaneWidgetAttributes.ContentState(startedAt: startedAt)
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
    resetValues()
    Task {
      for activity in Activity<XplaneWidgetAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }

  private func resetValues() {
    startedAt = nil
    pausedAt = nil
    currentActivity = nil
  }

  @objc
  func pause(_ timestamp: Double) -> Void {
    pausedAt = Date(timeIntervalSince1970: timestamp)
    let contentState = XplaneWidgetAttributes.ContentState(startedAt: startedAt, pausedAt: pausedAt)
    
    print(pausedAt)
    print("Pausing")
    Task {
      await currentActivity?.update(
        ActivityContent<XplaneWidgetAttributes.ContentState>(
          state: contentState,
          staleDate: nil
        )
      )
    }
  }

  @objc
  func resume() -> Void {
    guard let startDate = self.startedAt else { return }
    guard let pauseDate = self.pausedAt else { return }
    let elapsedSincePaused = Date().timeIntervalSince1970 - pauseDate.timeIntervalSince1970
    startedAt = Date(timeIntervalSince1970: startDate.timeIntervalSince1970 + elapsedSincePaused)
    pausedAt = nil
    let contentState = XplaneWidgetAttributes.ContentState(startedAt: startedAt, pausedAt: nil)
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
