//
//  CalendarService.swift
//  menubarcalendar-macOS
//
//  Created by Salvatore Zicaro on 31.05.20.
//

import Foundation
import EventKit

class CalendarService {
  var eventStore = EKEventStore()

  init() {
      NotificationCenter.default.addObserver(self, selector: #selector(getCalendarEvents), name: .EKEventStoreChanged, object: self.eventStore)
  }
    
  @objc func getCalendarEvents(){
    getEventStorePermission {
      permission in
      if permission {
        let result = self.getEvents()
        RNEventEmitter.emitter.sendEvent(withName: "onReceiveCalendarEvents", body: ["data": result])
      }
    }
  }
  
  func getEventStorePermission(completed: @escaping (Bool) -> Void) {
    switch EKEventStore.authorizationStatus(for: .event) {
    case .authorized:
      completed(true)
    case .denied:
      completed(false)
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
  
  func getEvents() -> [Any] {
    var result: [Any] = []
    let calendars = self.eventStore.calendars(for: .event)
    for calendar in calendars {
      let startDate = NSDate(timeIntervalSinceNow: -24*60*60)
      let endDate = NSDate(timeIntervalSinceNow: 24*60*60)
      let predicate = self.eventStore.predicateForEvents(withStart: startDate as Date, end: endDate as Date, calendars: [calendar])
      let events = self.eventStore.events(matching: predicate)
      for event in events {
        result.append([
          "calendarTitle": calendar.title,
          "eventTitle": event.title,
          "calendarColor": self.getColorString(color: calendar.color)
        ]);
      }
    }
    return result
  }
  
  
  func getColorString(color: NSColor) -> String {
    let color = color.usingColorSpace(NSColorSpace.extendedSRGB) ?? color
    // print("red: \(color.redComponent) green:\(color.greenComponent) blue:\(color.blueComponent)")
    return "\(color.redComponent * 255),\(color.greenComponent * 255),\(color.blueComponent * 255)";
  }
}
