//
//  XplaneWidgetModule.m
//  xplaneapp
//
//  Created by Ivan Lysov on 24/06/24.
//


#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(XplaneWidgetModule, NSObject)

+ (bool)requiresMainQueueSetup {
  return NO;
}

RCT_EXTERN_METHOD(startLiveActivity:(nonnull double *)timestamp)
RCT_EXTERN_METHOD(pause:(nonnull double *)timestamp)
RCT_EXTERN_METHOD(resume)
RCT_EXTERN_METHOD(stopLiveActivity)

@end
