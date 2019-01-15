//
//  ViewController.swift
//  Gorli
//
//  Created by Mike Lazer-Walker on 15.01.19.
//  Copyright © 2019 Mike Lazer-Walker. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []

        let webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false

        view = webView

        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "build")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print(error)
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("Did start provisional")
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("Finished")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("Fail provisional", error)
    }
}

