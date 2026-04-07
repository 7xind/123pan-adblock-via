// ==UserScript==
// @name 隐藏123云盘广告（Via专用版）
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 基于Via浏览器环境优化，强力去除123云盘红包弹窗 打赏及滚动广告
// @author AI Qwen
// @license MIT
// @match *://*.123pan.com/*
// @match *://*.123pan.cn/*
// @match *://*.123684.com/*
// @match *://*.123865.com/*
// @match *://*.123952.com/*
// @match *://*.123912.com/*
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/570058/%E9%9A%90%E8%97%8F123%E4%BA%91%E7%9B%98%E5%B9%BF%E5%91%8A%EF%BC%88Via%E4%B8%93%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/570058/%E9%9A%90%E8%97%8F123%E4%BA%91%E7%9B%98%E5%B9%BF%E5%91%8A%EF%BC%88Via%E4%B8%93%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 【核心修改】增加更广泛的隐藏规则
    // 除了具体的类名，我们还增加了基于包含文字（"打赏"）和层级（z-index）的通用选择器
    const hideRulesText = `
##.ant-modal-root > .tuia-modal-wrap
##.ant-modal-root > .ant-modal-mask
##.banner-container-h5
##.ant-carousel
##.banner-container-h5
##.appBottomBtn.banner-bottom
##.reward-btn /* 常见的打赏按钮类名 */
##.donate-btn /* 常见的捐赠按钮类名 */
##.sponsor-btn /* 常见的赞助按钮类名 */
##.pay-btn /* 常见的支付/打赏按钮类名 */
##.fixed-bottom /* 常见的底部固定栏 */
##.fixed-right /* 常见的右侧固定栏 */
##.floating-btn /* 常见的悬浮按钮 */
##[style*="z-index: 9999"] /* 层级最高的元素通常是广告或悬浮窗 */
##[style*="z-index: 10000"] /* 层级最高的元素通常是广告或悬浮窗 */
##[class*="reward"] /* 类名中包含reward的元素 */
##[class*="donate"] /* 类名中包含donate的元素 */
##[class*="sponsor"] /* 类名中包含sponsor的元素 */
##[class*="pay"] /* 类名中包含pay的元素 */
##[class*="float"] /* 类名中包含float的元素 */
    `.trim();

    // 解析规则文本
    function parseHideRules(text) {
        const rules = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('##')) {
                const rule = trimmed.substring(2).trim();
                if (rule) {
                    rules.push(rule);
                }
            }
        }
        return rules;
    }

    // 应用隐藏规则
    function applyHideRules() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyStyles);
        } else {
            applyStyles();
        }
    }

    function applyStyles() {
        const HIDE_RULES = parseHideRules(hideRulesText);
        if (HIDE_RULES.length === 0) return;

        // 移除旧的样式
        const oldStyle = document.getElementById('hide-rules-style');
        if (oldStyle) oldStyle.remove();

        // 创建CSS规则
        let css = '';
        css += HIDE_RULES.map(rule => {
            return rule + ' { display: none !important; visibility: hidden !important; }';
        }).join('\n');

        // 创建并应用样式
        const style = document.createElement('style');
        style.id = 'hide-rules-style';
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);

        console.log('已应用隐藏规则，共', HIDE_RULES.length, '条');
    }

    // 监控DOM变化，防止动态加载的广告显示出来
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                applyStyles(); // 每次DOM变化都重新应用样式
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行
    applyHideRules();
    observeDOMChanges();

})();