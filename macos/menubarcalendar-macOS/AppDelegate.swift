//
//  AppDelegate.swift
//  menubarcalendar-macOS
//
//  Created by Salvatore Zicaro on 27.05.20.
//

import Foundation
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var popover: NSPopover!
  var bridge: RCTBridge!
  var statusBarItem: NSStatusItem!

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    NotificationCenter.default.addObserver(self, selector: #selector(updateDateTitle), name: .NSCalendarDayChanged, object: nil)
    let jsCodeLocation: URL
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "menubarcalendar", initialProperties: nil, launchOptions: nil)
    let rootViewController = NSViewController()
    rootViewController.view = rootView

    popover = NSPopover()

    popover.contentSize = NSSize(width: 400, height: 400)
    popover.animates = false
    popover.behavior = .semitransient
    popover.contentViewController = rootViewController

    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(70))

    if let button = statusBarItem.button {
      button.sendAction(on: [.leftMouseDown, .rightMouseUp])
      button.action = #selector(togglePopover(_:))
      button.title = getFormattedDate()
    }
  }

  @objc func updateDateTitle() {
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

}
