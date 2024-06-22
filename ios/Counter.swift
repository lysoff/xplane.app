//
//  Counter.swift
//  xplaneapp
//
//  Created by Ivan Lysov on 22/06/24.
//

import Foundation

@objc(Counter)
class Counter: NSObject {
  private var count = 0;
  
  @objc
  func increment() {
    count += 1;
    print(count);
  }
  
}
