//
//  LockScreenMenuModule.m
//  xplaneapp
//
//  Created by Ivan Lysov on 22/06/24.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(LockScreenMenuModule,RCTEventEmitter)

RCT_EXTERN_METHOD(setButtons:(NSString *)name)
RCT_EXTERN_METHOD(increment:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(decrement:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
