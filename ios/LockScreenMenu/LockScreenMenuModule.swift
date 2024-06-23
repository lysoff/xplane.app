//
//  LockScreenMenuModule.swift
//  xplaneapp
//
//  Created by Ivan Lysov on 22/06/24.
//

import Foundation
import SwiftUI
import WidgetKit

@available(iOS 14.0, *)
@objc(LockScreenMenuModule)
class LockScreenMenuModule: RCTEventEmitter{
  
  private var count = 0;

  @AppStorage("buttonname", store: UserDefaults(suiteName: "group.xplaneapp"))
  var buttonname: String = String();
  
  @objc
  func setButtons(_ name:String) {
    print("-------")
    print(name);
    print("-------")
    
    print("no error! 1")
    
//    callback([buttonname])
    print(UserDefaults(suiteName: "group.xplaneapp")?.value(forKey: "buttonname") ?? "Pusto")
    UserDefaults(suiteName: "group.xplaneapp")!.set(name, forKey: "buttonname")
//    
    print("no error!")
//
    
    
    WidgetCenter.shared.reloadAllTimelines();
  }
  
  @objc
  func increment(_ callback:RCTResponseSenderBlock){
    count += 1;
    print(count);
    callback(["count"])
//    sendEvent(withName: "onIncrement", body: ["count increase",count])
  }
  
  @objc
  override static func requiresMainQueueSetup() ->Bool{
    return true;
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable: Any]!{
    return ["initialCount": 0];
  }
  
  override func supportedEvents() -> [String]! {
    return ["onIncrement","onDecrement"];
  }
  
  @objc
  func decrement(_ resolve:RCTPromiseResolveBlock,
                 reject:RCTPromiseRejectBlock)
  {
    if(count == 0)
    {
      let error = NSError(domain: "", code: 200, userInfo: nil);
      reject("ERROR_COUNT","count cannot be negative",error);
    }
    else{
      count -= 1;
      resolve("count is \(count)");
      sendEvent(withName: "onDecrement", body: ["count decrease",count])
    }
  }
}
