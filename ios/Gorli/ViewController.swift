//
//  ViewController.swift
//  Gorli
//
//  Created by Mike Lazer-Walker on 15.01.19.
//  Copyright © 2019 Mike Lazer-Walker. All rights reserved.
//

import UIKit
import SafariServices
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, UIScrollViewDelegate, SFSafariViewControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()

        let userScript = WKUserScript(source: "window.skipPreload = true;",
                                      injectionTime: .atDocumentStart,
                                      forMainFrameOnly: true)


        let userContentController = WKUserContentController()
        userContentController.addUserScript(userScript)

        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        configuration.userContentController = userContentController

        let webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.delegate = self

        view = webView

        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "build")!
        webView.loadFileURL(url, allowingReadAccessTo: url)

        NotificationCenter.default.addObserver(forName: UIApplication.didEnterBackgroundNotification, object: nil, queue: nil) {_ in
            webView.evaluateJavaScript("var evt = new Event('appPause'); window.dispatchEvent(evt);", completionHandler: nil)
        }

        NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: nil) {_ in
            webView.evaluateJavaScript("var evt = new Event('appResume'); window.dispatchEvent(evt);", completionHandler: nil)
        }

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

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        guard let url = navigationAction.request.url else { return nil }
        if navigationAction.targetFrame == nil {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
        return nil
    }

    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return nil
    }

    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alert, animated: true, completion: nil)
        completionHandler()
    }

    // Open links in SFSafariViewContrller
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            return decisionHandler(.allow)
        }

        if navigationAction.navigationType == .linkActivated {
            let safariVC = SFSafariViewController(url: url)
            safariVC.delegate = self

            self.present(safariVC, animated: true, completion: nil)

            decisionHandler(.cancel)
        } else {
            decisionHandler(.allow)
        }
    }


    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        controller.dismiss(animated: true, completion: nil)
    }
}

