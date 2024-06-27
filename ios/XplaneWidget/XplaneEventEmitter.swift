//
//  XplaneEventEmitter.swift
//  xplaneapp
//
//  Created by Ivan Lysov on 25/06/24.
//

import Foundation

@objc(XplaneEventEmitter)
class XplaneEventEmitter: RCTEventEmitter {

  public static var emitter: XplaneEventEmitter?

  override init() {
    super.init()
    XplaneEventEmitter.emitter = self
  }

  override func supportedEvents() -> [String]! {
    return ["onPause", "onResume", "onReset"]
  }
}
