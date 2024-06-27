//
//  AppIntentPlaceholder.swift
//  XplaneWidgetExtension
//
//  Created by Ivan Lysov on 24/06/24.
//

import Foundation
import AppIntents

public struct ScoreIntent: LiveActivityIntent {
  @Parameter(title: "field") var field: String?
      
  public init(field: String?) {
      self.field = field
  }
      
  public init() {}
  
  public static var title: LocalizedStringResource = "Score"
  public func perform() async throws -> some IntentResult {
    return .result()
  }
}
