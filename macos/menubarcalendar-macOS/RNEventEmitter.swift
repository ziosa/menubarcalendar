//
//  RCTEventEmitter.swift
//  menubarcalendar-macOS
//
//  Created by Salvatore Zicaro on 29.05.20.
//

@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["onReady"]
  }
}
