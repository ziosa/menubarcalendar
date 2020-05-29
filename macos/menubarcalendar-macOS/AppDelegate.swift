//
//  AppDelegate.swift
//  menubarcalendar-macOS
//
//  Created by Salvatore Zicaro on 27.05.20.
//

import Foundation
import Cocoa
import EventKit

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var popover: NSPopover!
  var bridge: RCTBridge!
  var statusBarItem: NSStatusItem!
  var eventStore = EKEventStore()
  var rootView: RCTRootView!
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    NotificationCenter.default.addObserver(self, selector: #selector(updateTodayDate), name: .NSCalendarDayChanged, object: nil)
    let jsCodeLocation: URL
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
    rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "menubarcalendar", initialProperties: nil, launchOptions: nil)
    let rootViewController = NSViewController()
    rootViewController.view = rootView
    
    popover = NSPopover()
    
    popover.contentSize = NSSize(width: 400, height: 600)
    popover.animates = true
    popover.behavior = .semitransient
    popover.contentViewController = rootViewController
    
    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(70))
    
    if let button = statusBarItem.button {
      button.sendAction(on: [.leftMouseDown, .rightMouseUp])
      button.action = #selector(togglePopover(_:))
      button.title = getFormattedDate()
    }
    get_estore_permission {
      permission in
      if permission {
        var result = [Int: Any]()
        let calendars = self.eventStore.calendars(for: .event)
        for calendar in calendars {
          let startDate = Date()
          let endDate = NSDate(timeIntervalSinceNow: 24*60*60)
          let predicate = self.eventStore.predicateForEvents(withStart: startDate, end: endDate as Date, calendars: [calendar])
          let events = self.eventStore.events(matching: predicate)
          for (index,event) in events.enumerated() {
            result.updateValue([
              "calendarTitle": calendar.title,
              "eventTitle": event.title,
              "calendarColor": self.getColorString(color: calendar.color)
            ], forKey: index);
          }
        }
        RNEventEmitter.emitter.sendEvent(withName: "onReady", body: ["data": result])
      }
    }
  }
  
  
  func get_estore_permission(completed: @escaping (Bool) -> Void) {
    switch EKEventStore.authorizationStatus(for: .event) {
    case .authorized:
      print("Access")
    case .denied:
      print("Access denied")
    case .notDetermined:
      eventStore.requestAccess(to: .event, completion:
        {[weak self] (granted: Bool, error: Error?) -> Void in
          if granted {
            completed(true)
          } else {
            print("Access denied")
          }
      })
    default:
      print("Case default")
    }
  }
  
  @objc func updateTodayDate() {
    RNEventEmitter.emitter.sendEvent(withName: "updateTodayDate", body: [])
    if let button = statusBarItem.button {
      button.title = getFormattedDate()
    }
  }
  
  @objc func getFormattedDate() -> String {
    let date = Date()
    let formatter = DateFormatter()
    formatter.dateFormat = "dd.MM.yy"
    return formatter.string(from: date)
  }
  
  @objc func togglePopover(_ sender: AnyObject?) {
    let event = NSApp.currentEvent!
    if event.type == NSEvent.EventType.rightMouseUp {
      closePopover(sender: nil)
      
      statusBarItem.button?.isHighlighted = true
      
      let contextMenu = NSMenu();
      contextMenu.addItem(NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
      
      statusBarItem.menu = contextMenu
      statusBarItem.button?.performClick(nil)
      statusBarItem.menu = nil
    } else {
      if let button = statusBarItem.button {
        if self.popover.isShown {
          self.popover.performClose(sender)
        } else {
          self.popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)
          
          self.popover.contentViewController?.view.window?.becomeKey()
        }
      }
    }
  }
  
  func closePopover(sender: AnyObject?) {
    popover.performClose(sender)
  }
  
  func getColorString(color: NSColor) -> String {
    let color = color.usingColorSpace(NSColorSpace.extendedSRGB) ?? color
    print("red: \(color.redComponent) green:\(color.greenComponent) blue:\(color.blueComponent)")
    
    return "\(color.redComponent * 255),\(color.greenComponent * 255),\(color.blueComponent * 255)";
  }
  
}
