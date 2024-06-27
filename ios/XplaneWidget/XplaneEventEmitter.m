//
//  XplaneEventEmitter.m
//  xplaneapp
//
//  Created by Ivan Lysov on 25/06/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(XplaneEventEmitter, RCTEventEmitter)

+ (bool)requiresMainQueueSetup {
  return NO;
}

RCT_EXTERN_METHOD(supportedEvents)

@end
