//
//  AppIntent.swift
//  XplaneWidget
//
//  Created by Ivan Lysov on 24/06/24.
//


import Foundation
import AppIntents

public struct PauseIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Pause timer"
  public func perform() async throws -> some IntentResult {
    XplaneEventEmitter.emitter?.sendEvent(withName: "onPause", body: nil)
    return .result()
  }
}

public struct ResumeIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Resume timer"
  public func perform() async throws -> some IntentResult {
    XplaneEventEmitter.emitter?.sendEvent(withName: "onResume", body: nil)
    return .result()
  }
}

public struct ResetIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Reset timer"
  public func perform() async throws -> some IntentResult {
    XplaneEventEmitter.emitter?.sendEvent(withName: "onReset", body: nil)
    return .result()
  }
}
