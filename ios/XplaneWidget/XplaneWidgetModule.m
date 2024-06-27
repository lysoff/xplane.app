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

RCT_EXTERN_METHOD(setLiveActivity:(NSArray *)array)
RCT_EXTERN_METHOD(stopLiveActivity)

@end
