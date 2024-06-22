//
//  LockScreenMenuBundle.swift
//  LockScreenMenu
//
//  Created by Ivan Lysov on 21/06/24.
//

import WidgetKit
import SwiftUI

@main
struct LockScreenMenuBundle: WidgetBundle {
    var body: some Widget {
        LockScreenMenu()
        LockScreenMenuLiveActivity()
    }
}
