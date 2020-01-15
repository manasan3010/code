function Animator(t) {
    this.setOptions(t);
    var e = this;
    this.timerDelegate = function() {
        e.onTimerEvent()
    }
    ,
    this.subjects = [],
    this.subjectScopes = [],
    this.target = 0,
    this.state = 0,
    this.lastTime = null
}
function NumericalStyleSubject(t, e, a, n, i) {
    this.els = Animator.makeArray(t),
    "opacity" == e && window.ActiveXObject ? this.property = "filter" : this.property = Animator.camelize(e),
    this.from = parseFloat(a),
    this.to = parseFloat(n),
    this.units = null != i ? i : "px"
}
function ColorStyleSubject(t, e, a, n) {
    this.els = Animator.makeArray(t),
    this.property = Animator.camelize(e),
    this.to = this.expandColor(n),
    this.from = this.expandColor(a),
    this.origFrom = a,
    this.origTo = n
}
function DiscreteStyleSubject(t, e, a, n, i) {
    this.els = Animator.makeArray(t),
    this.property = Animator.camelize(e),
    this.from = a,
    this.to = n,
    this.threshold = i || .5
}
function CSSStyleSubject(t, e, a) {
    if (t = Animator.makeArray(t),
    this.subjects = [],
    0 != t.length) {
        var n, i, o, s, r, l, u, d;
        if (a)
            i = this.parseStyle(e, t[0]),
            n = this.parseStyle(a, t[0]);
        else
            for (o in i = {},
            n = this.parseStyle(e, t[0]))
                i[o] = CSSStyleSubject.getStyle(t[0], o);
        for (o in i)
            i[o] == n[o] && (delete i[o],
            delete n[o]);
        for (o in i) {
            var c = String(i[o])
              , h = String(n[o]);
            if (null != n[o]) {
                if (u = ColorStyleSubject.parseColor(c))
                    d = ColorStyleSubject.parseColor(h),
                    l = ColorStyleSubject;
                else if (c.match(CSSStyleSubject.numericalRe) && h.match(CSSStyleSubject.numericalRe)) {
                    u = parseFloat(c),
                    d = parseFloat(h),
                    l = NumericalStyleSubject,
                    r = CSSStyleSubject.numericalRe.exec(c);
                    var f = CSSStyleSubject.numericalRe.exec(h);
                    s = null != r[1] ? r[1] : null != f[1] ? f[1] : f
                } else {
                    if (!c.match(CSSStyleSubject.discreteRe) || !h.match(CSSStyleSubject.discreteRe)) {
                        window.DEBUG && alert("Unrecognised format for value of " + o + ": '" + i[o] + "'");
                        continue
                    }
                    u = c,
                    d = h,
                    l = DiscreteStyleSubject,
                    s = 0
                }
                this.subjects[this.subjects.length] = new l(t,o,u,d,s)
            } else
                window.DEBUG && alert("No to style provided for '" + o + '"')
        }
    }
}
function AnimatorChain(t, e) {
    this.animators = t,
    this.setOptions(e);
    for (var a = 0; a < this.animators.length; a++)
        this.listenTo(this.animators[a]);
    this.forwards = !1,
    this.current = 0
}
function Accordion(t) {
    this.setOptions(t);
    var e, a = this.options.initialSection;
    this.options.rememberance && (e = document.location.hash.substring(1)),
    this.rememberanceTexts = [],
    this.ans = [];
    for (var n = this, i = 0; i < this.options.sections.length; i++) {
        var o = this.options.sections[i]
          , s = new Animator(this.options.animatorOptions)
          , r = this.options.from + this.options.shift * i
          , l = this.options.to + this.options.shift * i;
        s.addSubject(new NumericalStyleSubject(o,this.options.property,r,l,this.options.units)),
        s.jumpTo(0);
        var u = this.options.getActivator(o);
        u.index = i,
        u.onclick = function() {
            n.show(this.index)
        }
        ,
        this.ans[this.ans.length] = s,
        this.rememberanceTexts[i] = u.innerHTML.replace(/\s/g, ""),
        this.rememberanceTexts[i] === e && (a = i)
    }
    this.show(a)
}
var threeSixtyPlayer;
Animator.prototype = {
    setOptions: function(t) {
        this.options = Animator.applyDefaults({
            interval: 20,
            duration: 400,
            onComplete: function() {},
            onStep: function() {},
            transition: Animator.tx.easeInOut
        }, t)
    },
    seekTo: function(t) {
        this.seekFromTo(this.state, t)
    },
    seekFromTo: function(t, e) {
        this.target = Math.max(0, Math.min(1, e)),
        this.state = Math.max(0, Math.min(1, t)),
        this.lastTime = (new Date).getTime(),
        this.intervalId || (this.intervalId = window.setInterval(this.timerDelegate, this.options.interval))
    },
    jumpTo: function(t) {
        this.target = this.state = Math.max(0, Math.min(1, t)),
        this.propagate()
    },
    toggle: function() {
        this.seekTo(1 - this.target)
    },
    addSubject: function(t, e) {
        return this.subjects[this.subjects.length] = t,
        this.subjectScopes[this.subjectScopes.length] = e,
        this
    },
    clearSubjects: function() {
        this.subjects = [],
        this.subjectScopes = []
    },
    propagate: function() {
        for (var t = this.options.transition(this.state), e = 0; e < this.subjects.length; e++)
            this.subjects[e].setState ? this.subjects[e].setState(t) : this.subjects[e].apply(this.subjectScopes[e], [t])
    },
    onTimerEvent: function() {
        var t = (new Date).getTime()
          , e = t - this.lastTime;
        this.lastTime = t;
        var a = e / this.options.duration * (this.state < this.target ? 1 : -1);
        Math.abs(a) >= Math.abs(this.state - this.target) ? this.state = this.target : this.state += a;
        try {
            this.propagate()
        } finally {
            this.options.onStep.call(this),
            this.target == this.state && (window.clearInterval(this.intervalId),
            this.intervalId = null,
            this.options.onComplete.call(this))
        }
    },
    play: function() {
        this.seekFromTo(0, 1)
    },
    reverse: function() {
        this.seekFromTo(1, 0)
    },
    inspect: function() {
        for (var t = "#<Animator:\n", e = 0; e < this.subjects.length; e++)
            t += this.subjects[e].inspect();
        return t += ">"
    }
},
Animator.applyDefaults = function(t, e) {
    e = e || {};
    var a, n = {};
    for (a in t)
        n[a] = void 0 !== e[a] ? e[a] : t[a];
    return n
}
,
Animator.makeArray = function(t) {
    if (null == t)
        return [];
    if (!t.length)
        return [t];
    for (var e = [], a = 0; a < t.length; a++)
        e[a] = t[a];
    return e
}
,
Animator.camelize = function(t) {
    var e = t.split("-");
    if (1 == e.length)
        return e[0];
    for (var a = 0 == t.indexOf("-") ? e[0].charAt(0).toUpperCase() + e[0].substring(1) : e[0], n = 1, i = e.length; n < i; n++) {
        var o = e[n];
        a += o.charAt(0).toUpperCase() + o.substring(1)
    }
    return a
}
,
Animator.apply = function(t, e, a) {
    return e instanceof Array ? new Animator(a).addSubject(new CSSStyleSubject(t,e[0],e[1])) : new Animator(a).addSubject(new CSSStyleSubject(t,e))
}
,
Animator.makeEaseIn = function(e) {
    return function(t) {
        return Math.pow(t, 2 * e)
    }
}
,
Animator.makeEaseOut = function(e) {
    return function(t) {
        return 1 - Math.pow(1 - t, 2 * e)
    }
}
,
Animator.makeElastic = function(e) {
    return function(t) {
        return t = Animator.tx.easeInOut(t),
        (1 - Math.cos(t * Math.PI * e)) * (1 - t) + t
    }
}
,
Animator.makeADSR = function(e, a, n, i) {
    return null == i && (i = .5),
    function(t) {
        return t < e ? t / e : t < a ? 1 - (t - e) / (a - e) * (1 - i) : t < n ? i : i * (1 - (t - n) / (1 - n))
    }
}
,
Animator.makeBounce = function(t) {
    var e = Animator.makeElastic(t);
    return function(t) {
        return (t = e(t)) <= 1 ? t : 2 - t
    }
}
,
Animator.tx = {
    easeInOut: function(t) {
        return -Math.cos(t * Math.PI) / 2 + .5
    },
    linear: function(t) {
        return t
    },
    easeIn: Animator.makeEaseIn(1.5),
    easeOut: Animator.makeEaseOut(1.5),
    strongEaseIn: Animator.makeEaseIn(2.5),
    strongEaseOut: Animator.makeEaseOut(2.5),
    elastic: Animator.makeElastic(1),
    veryElastic: Animator.makeElastic(3),
    bouncy: Animator.makeBounce(1),
    veryBouncy: Animator.makeBounce(3)
},
NumericalStyleSubject.prototype = {
    setState: function(t) {
        for (var e = this.getStyle(t), a = (this.property,
        0), n = 0; n < this.els.length; n++) {
            try {
                this.els[n].style[this.property] = e
            } catch (t) {
                if ("fontWeight" != this.property)
                    throw t
            }
            if (20 < a++)
                return
        }
    },
    getStyle: function(t) {
        return t = this.from + (this.to - this.from) * t,
        "filter" == this.property ? "alpha(opacity=" + Math.round(100 * t) + ")" : "opacity" == this.property ? t : Math.round(t) + this.units
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.from + this.units + " to " + this.to + this.units + ")\n"
    }
},
ColorStyleSubject.prototype = {
    expandColor: function(t) {
        var e;
        if (e = ColorStyleSubject.parseColor(t))
            return [parseInt(e.slice(1, 3), 16), parseInt(e.slice(3, 5), 16), parseInt(e.slice(5, 7), 16)];
        window.DEBUG && alert("Invalid colour: '" + t + "'")
    },
    getValueForState: function(t, e) {
        return Math.round(this.from[t] + (this.to[t] - this.from[t]) * e)
    },
    setState: function(t) {
        for (var e = "#" + ColorStyleSubject.toColorPart(this.getValueForState(0, t)) + ColorStyleSubject.toColorPart(this.getValueForState(1, t)) + ColorStyleSubject.toColorPart(this.getValueForState(2, t)), a = 0; a < this.els.length; a++)
            this.els[a].style[this.property] = e
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.origFrom + " to " + this.origTo + ")\n"
    }
},
ColorStyleSubject.parseColor = function(t) {
    var e, a = "#";
    if (e = ColorStyleSubject.parseColor.rgbRe.exec(t)) {
        for (var n, i = 1; i <= 3; i++)
            n = Math.max(0, Math.min(255, parseInt(e[i]))),
            a += ColorStyleSubject.toColorPart(n);
        return a
    }
    if (e = ColorStyleSubject.parseColor.hexRe.exec(t)) {
        if (3 != e[1].length)
            return "#" + e[1];
        for (i = 0; i < 3; i++)
            a += e[1].charAt(i) + e[1].charAt(i);
        return a
    }
    return !1
}
,
ColorStyleSubject.toColorPart = function(t) {
    255 < t && (t = 255);
    var e = t.toString(16);
    return t < 16 ? "0" + e : e
}
,
ColorStyleSubject.parseColor.rgbRe = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
ColorStyleSubject.parseColor.hexRe = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
DiscreteStyleSubject.prototype = {
    setState: function(t) {
        for (var e = 0; e < this.els.length; e++)
            this.els[e].style[this.property] = t <= this.threshold ? this.from : this.to
    },
    inspect: function() {
        return "\t" + this.property + "(" + this.from + " to " + this.to + " @ " + this.threshold + ")\n"
    }
},
CSSStyleSubject.prototype = {
    parseStyle: function(t, e) {
        var a = {};
        if (-1 != t.indexOf(":"))
            for (var n = t.split(";"), i = 0; i < n.length; i++) {
                var o = CSSStyleSubject.ruleRe.exec(n[i]);
                o && (a[o[1]] = o[2])
            }
        else {
            var s, r, l;
            l = e.className,
            e.className = t;
            for (i = 0; i < CSSStyleSubject.cssProperties.length; i++)
                s = CSSStyleSubject.cssProperties[i],
                null != (r = CSSStyleSubject.getStyle(e, s)) && (a[s] = r);
            e.className = l
        }
        return a
    },
    setState: function(t) {
        for (var e = 0; e < this.subjects.length; e++)
            this.subjects[e].setState(t)
    },
    inspect: function() {
        for (var t = "", e = 0; e < this.subjects.length; e++)
            t += this.subjects[e].inspect();
        return t
    }
},
CSSStyleSubject.getStyle = function(t, e) {
    var a;
    return document.defaultView && document.defaultView.getComputedStyle && (a = document.defaultView.getComputedStyle(t, "").getPropertyValue(e)) ? a : (e = Animator.camelize(e),
    t.currentStyle && (a = t.currentStyle[e]),
    a || t.style[e])
}
,
CSSStyleSubject.ruleRe = /^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/,
CSSStyleSubject.numericalRe = /^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/,
CSSStyleSubject.discreteRe = /^\w+$/,
CSSStyleSubject.cssProperties = ["azimuth", "background", "background-attachment", "background-color", "background-image", "background-position", "background-repeat", "border-collapse", "border-color", "border-spacing", "border-style", "border-top", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-width", "bottom", "clear", "clip", "color", "content", "cursor", "direction", "display", "elevation", "empty-cells", "css-float", "font", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "height", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "max-height", "max-width", "min-height", "min-width", "orphans", "outline", "outline-color", "outline-style", "outline-width", "overflow", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "pause", "position", "right", "size", "table-layout", "text-align", "text-decoration", "text-indent", "text-shadow", "text-transform", "top", "vertical-align", "visibility", "white-space", "width", "word-spacing", "z-index", "opacity", "outline-offset", "overflow-x", "overflow-y"],
AnimatorChain.prototype = {
    setOptions: function(t) {
        this.options = Animator.applyDefaults({
            resetOnPlay: !0
        }, t)
    },
    play: function() {
        if (this.forwards = !0,
        this.current = -1,
        this.options.resetOnPlay)
            for (var t = 0; t < this.animators.length; t++)
                this.animators[t].jumpTo(0);
        this.advance()
    },
    reverse: function() {
        if (this.forwards = !1,
        this.current = this.animators.length,
        this.options.resetOnPlay)
            for (var t = 0; t < this.animators.length; t++)
                this.animators[t].jumpTo(1);
        this.advance()
    },
    toggle: function() {
        this.forwards ? this.seekTo(0) : this.seekTo(1)
    },
    listenTo: function(t) {
        var e = t.options.onComplete
          , a = this;
        t.options.onComplete = function() {
            e && e.call(t),
            a.advance()
        }
    },
    advance: function() {
        if (this.forwards) {
            if (null == this.animators[this.current + 1])
                return;
            this.current++,
            this.animators[this.current].play()
        } else {
            if (null == this.animators[this.current - 1])
                return;
            this.current--,
            this.animators[this.current].reverse()
        }
    },
    seekTo: function(t) {
        t <= 0 ? (this.forwards = !1,
        this.animators[this.current].seekTo(0)) : (this.forwards = !0,
        this.animators[this.current].seekTo(1))
    }
},
Accordion.prototype = {
    setOptions: function(t) {
        this.options = Object.extend({
            sections: null,
            getActivator: function(t) {
                return document.getElementById(t.getAttribute("activator"))
            },
            shift: 0,
            initialSection: 0,
            rememberance: !0,
            animatorOptions: {}
        }, t || {})
    },
    show: function(t) {
        for (var e = 0; e < this.ans.length; e++)
            this.ans[e].seekTo(t < e ? 1 : 0);
        this.options.rememberance && (document.location.hash = this.rememberanceTexts[t])
    }
},
function(Yt, $t) {
    function e(t, e) {
        function i(t) {
            return lt.preferFlash && et && !lt.ignoreFlash && lt.flash[t] !== $t && lt.flash[t]
        }
        function a(a) {
            return function(t) {
                var e = this._s;
                return e && e._a ? a.call(this, t) : null
            }
        }
        this.setupOptions = {
            url: t || null,
            flashVersion: 8,
            debugMode: !0,
            debugFlash: !1,
            useConsole: !0,
            consoleOnly: !0,
            waitForWindowLoad: !1,
            bgColor: "#ffffff",
            useHighPerformance: !1,
            flashPollingInterval: null,
            html5PollingInterval: null,
            flashLoadTimeout: 1e3,
            wmode: null,
            allowScriptAccess: "always",
            useFlashBlock: !1,
            useHTML5Audio: !0,
            forceUseGlobalHTML5Audio: !1,
            ignoreMobileRestrictions: !1,
            html5Test: /^(probably|maybe)$/i,
            preferFlash: !1,
            noSWFCache: !1,
            idPrefix: "sound"
        },
        this.defaultOptions = {
            autoLoad: !1,
            autoPlay: !1,
            from: null,
            loops: 1,
            onid3: null,
            onerror: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onposition: null,
            onstop: null,
            onfinish: null,
            multiShot: !0,
            multiShotEvents: !1,
            position: null,
            pan: 0,
            playbackRate: 1,
            stream: !0,
            to: null,
            type: null,
            usePolicyFile: !1,
            volume: 100
        },
        this.flash9Options = {
            onfailure: null,
            isMovieStar: null,
            usePeakData: !1,
            useWaveformData: !1,
            useEQData: !1,
            onbufferchange: null,
            ondataerror: null
        },
        this.movieStarOptions = {
            bufferTime: 3,
            serverURL: null,
            onconnect: null,
            duration: null
        },
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: !0
            },
            mp4: {
                related: ["aac", "m4a", "m4b"],
                type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: !1
            },
            ogg: {
                type: ["audio/ogg; codecs=vorbis"],
                required: !1
            },
            opus: {
                type: ["audio/ogg; codecs=opus", "audio/opus"],
                required: !1
            },
            wav: {
                type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
                required: !1
            },
            flac: {
                type: ["audio/flac"],
                required: !1
            }
        },
        this.movieID = "sm2-container",
        this.id = e || "sm2movie",
        this.debugID = "soundmanager-debug",
        this.debugURLParam = /([#?&])debug=1/i,
        this.versionNumber = "V2.97a.20170601",
        this.altURL = this.movieURL = this.version = null,
        this.enabled = this.swfLoaded = !1,
        this.oMC = null,
        this.sounds = {},
        this.soundIDs = [],
        this.didFlashBlock = this.muted = !1,
        this.filePattern = null,
        this.filePatterns = {
            flash8: /\.mp3(\?.*)?$/i,
            flash9: /\.mp3(\?.*)?$/i
        },
        this.features = {
            buffering: !1,
            peakData: !1,
            waveformData: !1,
            eqData: !1,
            movieStar: !1
        },
        this.sandbox = {},
        this.html5 = {
            usingFlash: null
        },
        this.flash = {},
        this.ignoreFlash = this.html5Only = !1;
        var o, c, n, s, h, y, r, v, l, u, d, f, m, p, g, _, S, b, M, T, w, C, O, D, P, L, I, E, A, N, x, k, R, H, F, B, j, U, V, q, W, z, X, Q, Y, $, G, K, Z, J, tt, et, at, nt, it, ot, st, rt, lt = this, ut = null, dt = null, ct = navigator.userAgent, ht = Yt.location.href.toString(), ft = document, mt = [], pt = !1, gt = !1, yt = !1, vt = !1, _t = !1, St = null, bt = null, Mt = !1, Tt = !1, wt = 0, Ct = null, Ot = [], Dt = null, Pt = Array.prototype.slice, Lt = !1, It = 0, Et = ct.match(/(ipad|iphone|ipod)/i), At = ct.match(/android/i), Nt = ct.match(/msie|trident/i), xt = ct.match(/webkit/i), kt = ct.match(/safari/i) && !ct.match(/chrome/i), Rt = ct.match(/opera/i), Ht = ct.match(/(mobile|pre\/|xoom)/i) || Et || At, Ft = !ht.match(/usehtml5audio/i) && !ht.match(/sm2-ignorebadua/i) && kt && !ct.match(/silk/i) && ct.match(/OS\sX\s10_6_([3-7])/i), Bt = ft.hasFocus !== $t ? ft.hasFocus() : null, jt = kt && (ft.hasFocus === $t || !ft.hasFocus()), Ut = !jt, Vt = /(mp3|mp4|mpa|m4a|m4b)/i, qt = ft.location ? ft.location.protocol.match(/http/i) : null, Wt = qt ? "" : "//", zt = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4|m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i, Xt = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "), Qt = new RegExp("\\.(" + Xt.join("|") + ")(\\?.*)?$","i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i,
        this.useAltURL = !qt,
        Y = [null, "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", "MEDIA_ERR_DECODE", "MEDIA_ERR_SRC_NOT_SUPPORTED"];
        try {
            rt = Audio !== $t && (Rt && opera !== $t && opera.version() < 10 ? new Audio(null) : new Audio).canPlayType !== $t
        } catch (t) {
            rt = !1
        }
        this.hasHTML5 = rt,
        this.setup = function(t) {
            var e = !lt.url;
            return t !== $t && yt && Dt && lt.ok(),
            l(t),
            Lt || (Ht ? lt.setupOptions.ignoreMobileRestrictions && !lt.setupOptions.forceUseGlobalHTML5Audio || (Ot.push(M.globalHTML5),
            Lt = !0) : lt.setupOptions.forceUseGlobalHTML5Audio && (Ot.push(M.globalHTML5),
            Lt = !0)),
            !st && Ht && (lt.setupOptions.ignoreMobileRestrictions ? Ot.push(M.ignoreMobile) : (lt.setupOptions.useHTML5Audio = !0,
            lt.setupOptions.preferFlash = !1,
            Et ? lt.ignoreFlash = !0 : (At && !ct.match(/android\s2\.3/i) || !At) && (Lt = !0))),
            t && (e && O && t.url !== $t && lt.beginDelayedInit(),
            O || t.url === $t || "complete" !== ft.readyState || setTimeout(w, 1)),
            st = !0,
            lt
        }
        ,
        this.supported = this.ok = function() {
            return Dt ? yt && !vt : lt.useHTML5Audio && lt.hasHTML5
        }
        ,
        this.getMovie = function(t) {
            return c(t) || ft[t] || Yt[t]
        }
        ,
        this.createSound = function(t, e) {
            function a() {
                return n = H(n),
                lt.sounds[n.id] = new o(n),
                lt.soundIDs.push(n.id),
                lt.sounds[n.id]
            }
            var n, i = null;
            if (!yt || !lt.ok())
                return !1;
            if (e !== $t && (t = {
                id: t,
                url: e
            }),
            (n = v(t)).url = q(n.url),
            n.id === $t && (n.id = lt.setupOptions.idPrefix + It++),
            B(n.id, !0))
                return lt.sounds[n.id];
            if (X(n))
                (i = a())._setup_html5(n);
            else {
                if (lt.html5Only || lt.html5.usingFlash && n.url && n.url.match(/data:/i))
                    return a();
                8 < y && null === n.isMovieStar && (n.isMovieStar = !!(n.serverURL || n.type && n.type.match(zt) || n.url && n.url.match(Qt))),
                n = F(n, void 0),
                i = a(),
                8 === y ? dt._createSound(n.id, n.loops || 1, n.usePolicyFile) : (dt._createSound(n.id, n.url, n.usePeakData, n.useWaveformData, n.useEQData, n.isMovieStar, !!n.isMovieStar && n.bufferTime, n.loops || 1, n.serverURL, n.duration || null, n.autoPlay, !0, n.autoLoad, n.usePolicyFile),
                n.serverURL || (i.connected = !0,
                n.onconnect && n.onconnect.apply(i))),
                n.serverURL || !n.autoLoad && !n.autoPlay || i.load(n)
            }
            return !n.serverURL && n.autoPlay && i.play(),
            i
        }
        ,
        this.destroySound = function(t, e) {
            if (!B(t))
                return !1;
            var a, n = lt.sounds[t];
            for (n.stop(),
            n._iO = {},
            n.unload(),
            a = 0; a < lt.soundIDs.length; a++)
                if (lt.soundIDs[a] === t) {
                    lt.soundIDs.splice(a, 1);
                    break
                }
            return e || n.destruct(!0),
            delete lt.sounds[t],
            !0
        }
        ,
        this.load = function(t, e) {
            return !!B(t) && lt.sounds[t].load(e)
        }
        ,
        this.unload = function(t) {
            return !!B(t) && lt.sounds[t].unload()
        }
        ,
        this.onposition = this.onPosition = function(t, e, a, n) {
            return !!B(t) && lt.sounds[t].onposition(e, a, n)
        }
        ,
        this.clearOnPosition = function(t, e, a) {
            return !!B(t) && lt.sounds[t].clearOnPosition(e, a)
        }
        ,
        this.start = this.play = function(t, e) {
            var a = null
              , n = e && !(e instanceof Object);
            if (!yt || !lt.ok())
                return !1;
            if (B(t, n))
                n && (e = {
                    url: e
                });
            else {
                if (!n)
                    return !1;
                n && (e = {
                    url: e
                }),
                e && e.url && (e.id = t,
                a = lt.createSound(e).play())
            }
            return null === a && (a = lt.sounds[t].play(e)),
            a
        }
        ,
        this.setPlaybackRate = function(t, e, a) {
            return !!B(t) && lt.sounds[t].setPlaybackRate(e, a)
        }
        ,
        this.setPosition = function(t, e) {
            return !!B(t) && lt.sounds[t].setPosition(e)
        }
        ,
        this.stop = function(t) {
            return !!B(t) && lt.sounds[t].stop()
        }
        ,
        this.stopAll = function() {
            for (var t in lt.sounds)
                lt.sounds.hasOwnProperty(t) && lt.sounds[t].stop()
        }
        ,
        this.pause = function(t) {
            return !!B(t) && lt.sounds[t].pause()
        }
        ,
        this.pauseAll = function() {
            var t;
            for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                lt.sounds[lt.soundIDs[t]].pause()
        }
        ,
        this.resume = function(t) {
            return !!B(t) && lt.sounds[t].resume()
        }
        ,
        this.resumeAll = function() {
            var t;
            for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                lt.sounds[lt.soundIDs[t]].resume()
        }
        ,
        this.togglePause = function(t) {
            return !!B(t) && lt.sounds[t].togglePause()
        }
        ,
        this.setPan = function(t, e) {
            return !!B(t) && lt.sounds[t].setPan(e)
        }
        ,
        this.setVolume = function(t, e) {
            var a, n;
            if (t === $t || isNaN(t) || e !== $t)
                return !!B(t) && lt.sounds[t].setVolume(e);
            for (a = 0,
            n = lt.soundIDs.length; a < n; a++)
                lt.sounds[lt.soundIDs[a]].setVolume(t);
            return !1
        }
        ,
        this.mute = function(t) {
            var e = 0;
            if (t instanceof String && (t = null),
            t)
                return !!B(t) && lt.sounds[t].mute();
            for (e = lt.soundIDs.length - 1; 0 <= e; e--)
                lt.sounds[lt.soundIDs[e]].mute();
            return lt.muted = !0
        }
        ,
        this.muteAll = function() {
            lt.mute()
        }
        ,
        this.unmute = function(t) {
            if (t instanceof String && (t = null),
            t)
                return !!B(t) && lt.sounds[t].unmute();
            for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                lt.sounds[lt.soundIDs[t]].unmute();
            return !(lt.muted = !1)
        }
        ,
        this.unmuteAll = function() {
            lt.unmute()
        }
        ,
        this.toggleMute = function(t) {
            return !!B(t) && lt.sounds[t].toggleMute()
        }
        ,
        this.getMemoryUse = function() {
            var t = 0;
            return dt && 8 !== y && (t = parseInt(dt._getMemoryUse(), 10)),
            t
        }
        ,
        this.disable = function(t) {
            var e;
            if (t === $t && (t = !1),
            vt)
                return !1;
            for (vt = !0,
            e = lt.soundIDs.length - 1; 0 <= e; e--)
                E(lt.sounds[lt.soundIDs[e]]);
            return E(lt),
            r(t),
            J.remove(Yt, "load", m),
            !0
        }
        ,
        this.canPlayMIME = function(t) {
            var e;
            return lt.hasHTML5 && (e = Q({
                type: t
            })),
            !e && Dt && (e = t && lt.ok() ? !!(8 < y && t.match(zt) || t.match(lt.mimePattern)) : null),
            e
        }
        ,
        this.canPlayURL = function(t) {
            var e;
            return lt.hasHTML5 && (e = Q({
                url: t
            })),
            !e && Dt && (e = t && lt.ok() ? !!t.match(lt.filePattern) : null),
            e
        }
        ,
        this.canPlayLink = function(t) {
            return !(t.type === $t || !t.type || !lt.canPlayMIME(t.type)) || lt.canPlayURL(t.href)
        }
        ,
        this.getSoundById = function(t, e) {
            return t ? lt.sounds[t] : null
        }
        ,
        this.onready = function(t, e) {
            if ("function" != typeof t)
                throw x("needFunction", "onready");
            return e || (e = Yt),
            d("onready", t, e),
            f(),
            !0
        }
        ,
        this.ontimeout = function(t, e) {
            if ("function" != typeof t)
                throw x("needFunction", "ontimeout");
            return e || (e = Yt),
            d("ontimeout", t, e),
            f({
                type: "ontimeout"
            }),
            !0
        }
        ,
        this._wD = this._writeDebug = function(t, e) {
            return !0
        }
        ,
        this._debug = function() {}
        ,
        this.reboot = function(t, e) {
            var a, n, i;
            for (a = lt.soundIDs.length - 1; 0 <= a; a--)
                lt.sounds[lt.soundIDs[a]].destruct();
            if (dt)
                try {
                    Nt && (bt = dt.innerHTML),
                    St = dt.parentNode.removeChild(dt)
                } catch (t) {}
            if (bt = St = Dt = dt = null,
            lt.enabled = O = yt = Mt = Tt = pt = gt = vt = Lt = lt.swfLoaded = !1,
            lt.soundIDs = [],
            lt.sounds = {},
            It = 0,
            st = !1,
            t)
                mt = [];
            else
                for (a in mt)
                    if (mt.hasOwnProperty(a))
                        for (n = 0,
                        i = mt[a].length; n < i; n++)
                            mt[a][n].fired = !1;
            return lt.html5 = {
                usingFlash: null
            },
            lt.flash = {},
            lt.html5Only = !1,
            lt.ignoreFlash = !1,
            Yt.setTimeout(function() {
                e || lt.beginDelayedInit()
            }, 20),
            lt
        }
        ,
        this.reset = function() {
            return lt.reboot(!0, !0)
        }
        ,
        this.getMoviePercent = function() {
            return dt && "PercentLoaded"in dt ? dt.PercentLoaded() : null
        }
        ,
        this.beginDelayedInit = function() {
            _t = !0,
            w(),
            setTimeout(function() {
                return !Tt && (P(),
                T(),
                Tt = !0)
            }, 20),
            p()
        }
        ,
        this.destruct = function() {
            lt.disable(!0)
        }
        ,
        o = function(t) {
            var i, o, s, r, e, a, l, u, n, d, c, h = this, f = !1, m = [], p = 0, g = null;
            o = i = null,
            this.sID = this.id = t.id,
            this.url = t.url,
            this._iO = this.instanceOptions = this.options = v(t),
            this.pan = this.options.pan,
            this.volume = this.options.volume,
            this.isHTML5 = !1,
            this._a = null,
            c = !this.url,
            this.id3 = {},
            this._debug = function() {}
            ,
            this.load = function(t) {
                var e;
                if (t !== $t ? h._iO = v(t, h.options) : (t = h.options,
                h._iO = t,
                g && g !== h.url && (h._iO.url = h.url,
                h.url = null)),
                h._iO.url || (h._iO.url = h.url),
                h._iO.url = q(h._iO.url),
                !(e = h.instanceOptions = h._iO).url && !h.url)
                    return h;
                if (e.url === h.url && 0 !== h.readyState && 2 !== h.readyState)
                    return 3 === h.readyState && e.onload && ot(h, function() {
                        e.onload.apply(h, [!!h.duration])
                    }),
                    h;
                if (h.loaded = !1,
                h.readyState = 1,
                h.playState = 0,
                h.id3 = {},
                X(e))
                    h._setup_html5(e)._called_load || (h._html5_canplay = !1,
                    h.url !== e.url && (h._a.src = e.url,
                    h.setPosition(0)),
                    h._a.autobuffer = "auto",
                    h._a.preload = "auto",
                    h._a._called_load = !0);
                else {
                    if (lt.html5Only || h._iO.url && h._iO.url.match(/data:/i))
                        return h;
                    try {
                        h.isHTML5 = !1,
                        h._iO = F(H(e)),
                        h._iO.autoPlay && (h._iO.position || h._iO.from) && (h._iO.autoPlay = !1),
                        e = h._iO,
                        8 === y ? dt._load(h.id, e.url, e.stream, e.autoPlay, e.usePolicyFile) : dt._load(h.id, e.url, !!e.stream, !!e.autoPlay, e.loops || 1, !!e.autoLoad, e.usePolicyFile)
                    } catch (t) {
                        L({
                            type: "SMSOUND_LOAD_JS_EXCEPTION",
                            fatal: !0
                        })
                    }
                }
                return h.url = e.url,
                h
            }
            ,
            this.unload = function() {
                return 0 !== h.readyState && (h.isHTML5 ? (a(),
                h._a && (h._a.pause(),
                g = G(h._a))) : 8 === y ? dt._unload(h.id, "about:blank") : dt._unload(h.id),
                s()),
                h
            }
            ,
            this.destruct = function(t) {
                h.isHTML5 ? (a(),
                h._a && (h._a.pause(),
                G(h._a),
                Lt || e(),
                h._a._s = null,
                h._a = null)) : (h._iO.onfailure = null,
                dt._destroySound(h.id)),
                t || lt.destroySound(h.id, !0)
            }
            ,
            this.start = this.play = function(t, e) {
                var a, n, i, o;
                if (a = !0,
                e = e === $t || e,
                t || (t = {}),
                h.url && (h._iO.url = h.url),
                h._iO = v(h._iO, h.options),
                h._iO = v(t, h._iO),
                h._iO.url = q(h._iO.url),
                h.instanceOptions = h._iO,
                !h.isHTML5 && h._iO.serverURL && !h.connected)
                    return h.getAutoPlay() || h.setAutoPlay(!0),
                    h;
                if (X(h._iO) && (h._setup_html5(h._iO),
                l()),
                1 === h.playState && !h.paused && !(a = h._iO.multiShot))
                    return h.isHTML5 && h.setPosition(h._iO.position),
                    h;
                if (t.url && t.url !== h.url && (h.readyState || h.isHTML5 || 8 !== y || !c ? h.load(h._iO) : c = !1),
                !h.loaded)
                    if (0 === h.readyState) {
                        if (h.isHTML5 || lt.html5Only) {
                            if (!h.isHTML5)
                                return h;
                            h.load(h._iO)
                        } else
                            h._iO.autoPlay = !0,
                            h.load(h._iO);
                        h.instanceOptions = h._iO
                    } else if (2 === h.readyState)
                        return h;
                return !h.isHTML5 && 9 === y && 0 < h.position && h.position === h.duration && (t.position = 0),
                h.paused && 0 <= h.position && (!h._iO.serverURL || 0 < h.position) ? h.resume() : (h._iO = v(t, h._iO),
                (!h.isHTML5 && null !== h._iO.position && 0 < h._iO.position || null !== h._iO.from && 0 < h._iO.from || null !== h._iO.to) && 0 === h.instanceCount && 0 === h.playState && !h._iO.serverURL && (a = function() {
                    h._iO = v(t, h._iO),
                    h.play(h._iO)
                }
                ,
                h.isHTML5 && !h._html5_canplay ? h.load({
                    _oncanplay: a
                }) : h.isHTML5 || h.loaded || h.readyState && 2 === h.readyState || h.load({
                    onload: a
                }),
                h._iO = d()),
                (!h.instanceCount || h._iO.multiShotEvents || h.isHTML5 && h._iO.multiShot && !Lt || !h.isHTML5 && 8 < y && !h.getAutoPlay()) && h.instanceCount++,
                h._iO.onposition && 0 === h.playState && u(h),
                h.playState = 1,
                h.paused = !1,
                h.position = h._iO.position === $t || isNaN(h._iO.position) ? 0 : h._iO.position,
                h.isHTML5 || (h._iO = F(H(h._iO))),
                h._iO.onplay && e && (h._iO.onplay.apply(h),
                f = !0),
                h.setVolume(h._iO.volume, !0),
                h.setPan(h._iO.pan, !0),
                1 !== h._iO.playbackRate && h.setPlaybackRate(h._iO.playbackRate),
                h.isHTML5 ? h.instanceCount < 2 ? (l(),
                a = h._setup_html5(),
                h.setPosition(h._iO.position),
                a.play()) : (n = new Audio(h._iO.url),
                i = function() {
                    J.remove(n, "ended", i),
                    h._onfinish(h),
                    G(n),
                    n = null
                }
                ,
                o = function() {
                    J.remove(n, "canplay", o);
                    try {
                        n.currentTime = h._iO.position / 1e3
                    } catch (t) {}
                    n.play()
                }
                ,
                J.add(n, "ended", i),
                h._iO.volume !== $t && (n.volume = Math.max(0, Math.min(1, h._iO.volume / 100))),
                h.muted && (n.muted = !0),
                h._iO.position ? J.add(n, "canplay", o) : n.play()) : (a = dt._start(h.id, h._iO.loops || 1, 9 === y ? h.position : h.position / 1e3, h._iO.multiShot || !1),
                9 !== y || a || h._iO.onplayerror && h._iO.onplayerror.apply(h))),
                h
            }
            ,
            this.stop = function(t) {
                var e = h._iO;
                return 1 === h.playState && (h._onbufferchange(0),
                h._resetOnPosition(0),
                h.paused = !1,
                h.isHTML5 || (h.playState = 0),
                n(),
                e.to && h.clearOnPosition(e.to),
                h.isHTML5 ? h._a && (t = h.position,
                h.setPosition(0),
                h.position = t,
                h._a.pause(),
                h.playState = 0,
                h._onTimer(),
                a()) : (dt._stop(h.id, t),
                e.serverURL && h.unload()),
                h.instanceCount = 0,
                h._iO = {},
                e.onstop && e.onstop.apply(h)),
                h
            }
            ,
            this.setAutoPlay = function(t) {
                h._iO.autoPlay = t,
                h.isHTML5 || (dt._setAutoPlay(h.id, t),
                t && (h.instanceCount || 1 !== h.readyState || h.instanceCount++))
            }
            ,
            this.getAutoPlay = function() {
                return h._iO.autoPlay
            }
            ,
            this.setPlaybackRate = function(t) {
                if (t = Math.max(.5, Math.min(4, t)),
                h.isHTML5)
                    try {
                        h._iO.playbackRate = t,
                        h._a.playbackRate = t
                    } catch (t) {}
                return h
            }
            ,
            this.setPosition = function(t) {
                t === $t && (t = 0);
                var e = h.isHTML5 ? Math.max(t, 0) : Math.min(h.duration || h._iO.duration, Math.max(t, 0));
                if (h.position = e,
                t = h.position / 1e3,
                h._resetOnPosition(h.position),
                h._iO.position = e,
                h.isHTML5) {
                    if (h._a) {
                        if (h._html5_canplay) {
                            if (h._a.currentTime.toFixed(3) !== t.toFixed(3))
                                try {
                                    h._a.currentTime = t,
                                    (0 === h.playState || h.paused) && h._a.pause()
                                } catch (t) {}
                        } else if (t)
                            return h;
                        h.paused && h._onTimer(!0)
                    }
                } else
                    t = 9 === y ? h.position : t,
                    h.readyState && 2 !== h.readyState && dt._setPosition(h.id, t, h.paused || !h.playState, h._iO.multiShot);
                return h
            }
            ,
            this.pause = function(t) {
                return h.paused || 0 === h.playState && 1 !== h.readyState || (h.paused = !0,
                h.isHTML5 ? (h._setup_html5().pause(),
                a()) : (t || t === $t) && dt._pause(h.id, h._iO.multiShot),
                h._iO.onpause && h._iO.onpause.apply(h)),
                h
            }
            ,
            this.resume = function() {
                var t = h._iO;
                return h.paused && (h.paused = !1,
                h.playState = 1,
                h.isHTML5 ? (h._setup_html5().play(),
                l()) : (t.isMovieStar && !t.serverURL && h.setPosition(h.position),
                dt._pause(h.id, t.multiShot)),
                !f && t.onplay ? (t.onplay.apply(h),
                f = !0) : t.onresume && t.onresume.apply(h)),
                h
            }
            ,
            this.togglePause = function() {
                return 0 === h.playState ? h.play({
                    position: 9 !== y || h.isHTML5 ? h.position / 1e3 : h.position
                }) : h.paused ? h.resume() : h.pause(),
                h
            }
            ,
            this.setPan = function(t, e) {
                return t === $t && (t = 0),
                e === $t && (e = !1),
                h.isHTML5 || dt._setPan(h.id, t),
                h._iO.pan = t,
                e || (h.pan = t,
                h.options.pan = t),
                h
            }
            ,
            this.setVolume = function(t, e) {
                return t === $t && (t = 100),
                e === $t && (e = !1),
                h.isHTML5 ? h._a && (lt.muted && !h.muted && (h.muted = !0,
                h._a.muted = !0),
                h._a.volume = Math.max(0, Math.min(1, t / 100))) : dt._setVolume(h.id, lt.muted && !h.muted || h.muted ? 0 : t),
                h._iO.volume = t,
                e || (h.volume = t,
                h.options.volume = t),
                h
            }
            ,
            this.mute = function() {
                return h.muted = !0,
                h.isHTML5 ? h._a && (h._a.muted = !0) : dt._setVolume(h.id, 0),
                h
            }
            ,
            this.unmute = function() {
                h.muted = !1;
                var t = h._iO.volume !== $t;
                return h.isHTML5 ? h._a && (h._a.muted = !1) : dt._setVolume(h.id, t ? h._iO.volume : h.options.volume),
                h
            }
            ,
            this.toggleMute = function() {
                return h.muted ? h.unmute() : h.mute()
            }
            ,
            this.onposition = this.onPosition = function(t, e, a) {
                return m.push({
                    position: parseInt(t, 10),
                    method: e,
                    scope: a !== $t ? a : h,
                    fired: !1
                }),
                h
            }
            ,
            this.clearOnPosition = function(t, e) {
                var a;
                if (t = parseInt(t, 10),
                !isNaN(t))
                    for (a = 0; a < m.length; a++)
                        t !== m[a].position || e && e !== m[a].method || (m[a].fired && p--,
                        m.splice(a, 1))
            }
            ,
            this._processOnPosition = function() {
                var t, e;
                if (!(t = m.length) || !h.playState || t <= p)
                    return !1;
                for (--t; 0 <= t; t--)
                    !(e = m[t]).fired && h.position >= e.position && (e.fired = !0,
                    p++,
                    e.method.apply(e.scope, [e.position]));
                return !0
            }
            ,
            this._resetOnPosition = function(t) {
                var e, a;
                if (!(e = m.length))
                    return !1;
                for (--e; 0 <= e; e--)
                    (a = m[e]).fired && t <= a.position && (a.fired = !1,
                    p--);
                return !0
            }
            ,
            d = function() {
                var t, e, a = h._iO, n = a.from, i = a.to;
                return e = function() {
                    h.clearOnPosition(i, e),
                    h.stop()
                }
                ,
                t = function() {
                    null === i || isNaN(i) || h.onPosition(i, e)
                }
                ,
                null === n || isNaN(n) || (a.position = n,
                a.multiShot = !1,
                t()),
                a
            }
            ,
            u = function() {
                var t, e = h._iO.onposition;
                if (e)
                    for (t in e)
                        e.hasOwnProperty(t) && h.onPosition(parseInt(t, 10), e[t])
            }
            ,
            n = function() {
                var t, e = h._iO.onposition;
                if (e)
                    for (t in e)
                        e.hasOwnProperty(t) && h.clearOnPosition(parseInt(t, 10))
            }
            ,
            l = function() {
                h.isHTML5 && j(h)
            }
            ,
            a = function() {
                h.isHTML5 && U(h)
            }
            ,
            (s = function(t) {
                t || (m = [],
                p = 0),
                f = !1,
                h._hasTimer = null,
                h._a = null,
                h._html5_canplay = !1,
                h.bytesLoaded = null,
                h.bytesTotal = null,
                h.duration = h._iO && h._iO.duration ? h._iO.duration : null,
                h.durationEstimate = null,
                h.buffered = [],
                h.eqData = [],
                h.eqData.left = [],
                h.eqData.right = [],
                h.failures = 0,
                h.isBuffering = !1,
                h.instanceOptions = {},
                h.instanceCount = 0,
                h.loaded = !1,
                h.metadata = {},
                h.readyState = 0,
                h.muted = !1,
                h.paused = !1,
                h.peakData = {
                    left: 0,
                    right: 0
                },
                h.waveformData = {
                    left: [],
                    right: []
                },
                h.playState = 0,
                h.position = null,
                h.id3 = {}
            }
            )(),
            this._onTimer = function(t) {
                var e, a = !1, n = {};
                return (h._hasTimer || t) && h._a && (t || (0 < h.playState || 1 === h.readyState) && !h.paused) && ((e = h._get_html5_duration()) !== i && (i = e,
                h.duration = e,
                a = !0),
                h.durationEstimate = h.duration,
                (e = 1e3 * h._a.currentTime || 0) !== o && (o = e,
                a = !0),
                (a || t) && h._whileplaying(e, n, n, n, n)),
                a
            }
            ,
            this._get_html5_duration = function() {
                var t = h._iO;
                return (t = h._a && h._a.duration ? 1e3 * h._a.duration : t && t.duration ? t.duration : null) && !isNaN(t) && 1 / 0 !== t ? t : null
            }
            ,
            this._apply_loop = function(t, e) {
                t.loop = 1 < e ? "loop" : ""
            }
            ,
            this._setup_html5 = function(t) {
                t = v(h._iO, t);
                var e, a = Lt ? ut : h._a, n = decodeURI(t.url);
                if (Lt ? n === decodeURI(tt) && (e = !0) : n === decodeURI(g) && (e = !0),
                a) {
                    if (a._s)
                        if (Lt)
                            a._s && a._s.playState && !e && a._s.stop();
                        else if (!Lt && n === decodeURI(g))
                            return h._apply_loop(a, t.loops),
                            a;
                    e || (g && s(!1),
                    a.src = t.url,
                    tt = g = h.url = t.url,
                    a._called_load = !1)
                } else
                    t.autoLoad || t.autoPlay ? (h._a = new Audio(t.url),
                    h._a.load()) : h._a = Rt && opera.version() < 10 ? new Audio(null) : new Audio,
                    (a = h._a)._called_load = !1,
                    Lt && (ut = a);
                return h.isHTML5 = !0,
                (h._a = a)._s = h,
                r(),
                h._apply_loop(a, t.loops),
                t.autoLoad || t.autoPlay ? h.load() : (a.autobuffer = !1,
                a.preload = "auto"),
                a
            }
            ,
            r = function() {
                if (h._a._added_events)
                    return !1;
                var t;
                for (t in h._a._added_events = !0,
                it)
                    it.hasOwnProperty(t) && h._a && h._a.addEventListener(t, it[t], !1);
                return !0
            }
            ,
            e = function() {
                var t;
                for (t in h._a._added_events = !1,
                it)
                    it.hasOwnProperty(t) && h._a && h._a.removeEventListener(t, it[t], !1)
            }
            ,
            this._onload = function(t) {
                var e = !!t || !h.isHTML5 && 8 === y && h.duration;
                return h.loaded = e,
                h.readyState = e ? 3 : 2,
                h._onbufferchange(0),
                e || h.isHTML5 || h._onerror(),
                h._iO.onload && ot(h, function() {
                    h._iO.onload.apply(h, [e])
                }),
                !0
            }
            ,
            this._onerror = function(t, e) {
                h._iO.onerror && ot(h, function() {
                    h._iO.onerror.apply(h, [t, e])
                })
            }
            ,
            this._onbufferchange = function(t) {
                return !(0 === h.playState || t && h.isBuffering || !t && !h.isBuffering) && (h.isBuffering = 1 === t,
                h._iO.onbufferchange && h._iO.onbufferchange.apply(h, [t]),
                !0)
            }
            ,
            this._onsuspend = function() {
                return h._iO.onsuspend && h._iO.onsuspend.apply(h),
                !0
            }
            ,
            this._onfailure = function(t, e, a) {
                h.failures++,
                h._iO.onfailure && 1 === h.failures && h._iO.onfailure(t, e, a)
            }
            ,
            this._onwarning = function(t, e, a) {
                h._iO.onwarning && h._iO.onwarning(t, e, a)
            }
            ,
            this._onfinish = function() {
                var t = h._iO.onfinish;
                h._onbufferchange(0),
                h._resetOnPosition(0),
                h.instanceCount && (h.instanceCount--,
                h.instanceCount || (n(),
                h.playState = 0,
                h.paused = !1,
                h.instanceCount = 0,
                h.instanceOptions = {},
                h._iO = {},
                a(),
                h.isHTML5 && (h.position = 0)),
                (!h.instanceCount || h._iO.multiShotEvents) && t && ot(h, function() {
                    t.apply(h)
                }))
            }
            ,
            this._whileloading = function(t, e, a, n) {
                var i = h._iO;
                h.bytesLoaded = t,
                h.bytesTotal = e,
                h.duration = Math.floor(a),
                h.bufferLength = n,
                h.durationEstimate = h.isHTML5 || i.isMovieStar ? h.duration : i.duration ? h.duration > i.duration ? h.duration : i.duration : parseInt(h.bytesTotal / h.bytesLoaded * h.duration, 10),
                h.isHTML5 || (h.buffered = [{
                    start: 0,
                    end: h.duration
                }]),
                (3 !== h.readyState || h.isHTML5) && i.whileloading && i.whileloading.apply(h)
            }
            ,
            this._whileplaying = function(t, e, a, n, i) {
                var o = h._iO;
                return !isNaN(t) && null !== t && (h.position = Math.max(0, t),
                h._processOnPosition(),
                !h.isHTML5 && 8 < y && (o.usePeakData && e !== $t && e && (h.peakData = {
                    left: e.leftPeak,
                    right: e.rightPeak
                }),
                o.useWaveformData && a !== $t && a && (h.waveformData = {
                    left: a.split(","),
                    right: n.split(",")
                }),
                o.useEQData && i !== $t && i && i.leftEQ && (t = i.leftEQ.split(","),
                h.eqData = t,
                h.eqData.left = t,
                i.rightEQ !== $t && i.rightEQ && (h.eqData.right = i.rightEQ.split(",")))),
                1 === h.playState && (h.isHTML5 || 8 !== y || h.position || !h.isBuffering || h._onbufferchange(0),
                o.whileplaying && o.whileplaying.apply(h)),
                !0)
            }
            ,
            this._oncaptiondata = function(t) {
                h.captiondata = t,
                h._iO.oncaptiondata && h._iO.oncaptiondata.apply(h, [t])
            }
            ,
            this._onmetadata = function(t, e) {
                var a, n, i = {};
                for (a = 0,
                n = t.length; a < n; a++)
                    i[t[a]] = e[a];
                h.metadata = i,
                h._iO.onmetadata && h._iO.onmetadata.call(h, h.metadata)
            }
            ,
            this._onid3 = function(t, e) {
                var a, n, i = [];
                for (a = 0,
                n = t.length; a < n; a++)
                    i[t[a]] = e[a];
                h.id3 = v(h.id3, i),
                h._iO.onid3 && h._iO.onid3.apply(h)
            }
            ,
            this._onconnect = function(t) {
                t = 1 === t,
                (h.connected = t) && (h.failures = 0,
                B(h.id) && (h.getAutoPlay() ? h.play($t, h.getAutoPlay()) : h._iO.autoLoad && h.load()),
                h._iO.onconnect && h._iO.onconnect.apply(h, [t]))
            }
            ,
            this._ondataerror = function(t) {
                0 < h.playState && h._iO.ondataerror && h._iO.ondataerror.apply(h)
            }
        }
        ,
        D = function() {
            return ft.body || ft.getElementsByTagName("div")[0]
        }
        ,
        c = function(t) {
            return ft.getElementById(t)
        }
        ,
        v = function(t, e) {
            var a, n, i = t || {};
            for (n in a = e === $t ? lt.defaultOptions : e)
                a.hasOwnProperty(n) && i[n] === $t && (i[n] = "object" != typeof a[n] || null === a[n] ? a[n] : v(i[n], a[n]));
            return i
        }
        ,
        ot = function(t, e) {
            t.isHTML5 || 8 !== y ? e() : Yt.setTimeout(e, 0)
        }
        ,
        u = {
            onready: 1,
            ontimeout: 1,
            defaultOptions: 1,
            flash9Options: 1,
            movieStarOptions: 1
        },
        l = function(t, e) {
            var a, n = !0, i = e !== $t, o = lt.setupOptions;
            for (a in t)
                if (t.hasOwnProperty(a))
                    if ("object" != typeof t[a] || null === t[a] || t[a]instanceof Array || t[a]instanceof RegExp)
                        i && u[e] !== $t ? lt[e][a] = t[a] : o[a] !== $t ? (lt.setupOptions[a] = t[a],
                        lt[a] = t[a]) : u[a] === $t ? n = !1 : lt[a]instanceof Function ? lt[a].apply(lt, t[a]instanceof Array ? t[a] : [t[a]]) : lt[a] = t[a];
                    else {
                        if (u[a] !== $t)
                            return l(t[a], a);
                        n = !1
                    }
            return n
        }
        ,
        J = function() {
            function t(t) {
                var e = (t = Pt.call(t)).length;
                return i ? (t[1] = "on" + t[1],
                3 < e && t.pop()) : 3 === e && t.push(!1),
                t
            }
            function e(t, e) {
                var a = t.shift()
                  , n = [o[e]];
                i ? a[n](t[0], t[1]) : a[n].apply(a, t)
            }
            var i = Yt.attachEvent
              , o = {
                add: i ? "attachEvent" : "addEventListener",
                remove: i ? "detachEvent" : "removeEventListener"
            };
            return {
                add: function() {
                    e(t(arguments), "add")
                },
                remove: function() {
                    e(t(arguments), "remove")
                }
            }
        }(),
        it = {
            abort: a(function() {}),
            canplay: a(function() {
                var t, e = this._s;
                if (!e._html5_canplay) {
                    if (e._html5_canplay = !0,
                    e._onbufferchange(0),
                    t = e._iO.position === $t || isNaN(e._iO.position) ? null : e._iO.position / 1e3,
                    this.currentTime !== t)
                        try {
                            this.currentTime = t
                        } catch (t) {}
                    e._iO._oncanplay && e._iO._oncanplay()
                }
            }),
            canplaythrough: a(function() {
                var t = this._s;
                t.loaded || (t._onbufferchange(0),
                t._whileloading(t.bytesLoaded, t.bytesTotal, t._get_html5_duration()),
                t._onload(!0))
            }),
            durationchange: a(function() {
                var t, e = this._s;
                t = e._get_html5_duration(),
                isNaN(t) || t === e.duration || (e.durationEstimate = e.duration = t)
            }),
            ended: a(function() {
                this._s._onfinish()
            }),
            error: a(function() {
                var t = Y[this.error.code] || null;
                this._s._onload(!1),
                this._s._onerror(this.error.code, t)
            }),
            loadeddata: a(function() {
                var t = this._s;
                t._loaded || kt || (t.duration = t._get_html5_duration())
            }),
            loadedmetadata: a(function() {}),
            loadstart: a(function() {
                this._s._onbufferchange(1)
            }),
            play: a(function() {
                this._s._onbufferchange(0)
            }),
            playing: a(function() {
                this._s._onbufferchange(0)
            }),
            progress: a(function(t) {
                var e, a, n = this._s, i = 0;
                i = t.target.buffered;
                e = t.loaded || 0;
                var o = t.total || 1;
                if (n.buffered = [],
                i && i.length) {
                    for (e = 0,
                    a = i.length; e < a; e++)
                        n.buffered.push({
                            start: 1e3 * i.start(e),
                            end: 1e3 * i.end(e)
                        });
                    i = 1e3 * (i.end(0) - i.start(0)),
                    e = Math.min(1, i / (1e3 * t.target.duration))
                }
                isNaN(e) || (n._whileloading(e, o, n._get_html5_duration()),
                e && o && e === o && it.canplaythrough.call(this, t))
            }),
            ratechange: a(function() {}),
            suspend: a(function(t) {
                var e = this._s;
                it.progress.call(this, t),
                e._onsuspend()
            }),
            stalled: a(function() {}),
            timeupdate: a(function() {
                this._s._onTimer()
            }),
            waiting: a(function() {
                this._s._onbufferchange(1)
            })
        },
        X = function(t) {
            return !(!t || !(t.type || t.url || t.serverURL)) && (!(t.serverURL || t.type && i(t.type)) && (t.type ? Q({
                type: t.type
            }) : Q({
                url: t.url
            }) || lt.html5Only || t.url.match(/data:/i)))
        }
        ,
        G = function(t) {
            var e;
            return t && (e = kt ? "about:blank" : lt.html5.canPlayType("audio/wav") ? "data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==" : "about:blank",
            t.src = e,
            t._called_unload !== $t && (t._called_load = !1)),
            Lt && (tt = null),
            e
        }
        ,
        Q = function(t) {
            if (!lt.useHTML5Audio || !lt.hasHTML5)
                return !1;
            var e = t.url || null;
            t = t.type || null;
            var a, n = lt.audioFormats;
            if (t && lt.html5[t] !== $t)
                return lt.html5[t] && !i(t);
            if (!$) {
                for (a in $ = [],
                n)
                    n.hasOwnProperty(a) && ($.push(a),
                    n[a].related && ($ = $.concat(n[a].related)));
                $ = new RegExp("\\.(" + $.join("|") + ")(\\?.*)?$","i")
            }
            return (a = e ? e.toLowerCase().match($) : null) && a.length ? a = a[1] : t && (a = (-1 !== (e = t.indexOf(";")) ? t.substr(0, e) : t).substr(6)),
            e = a && lt.html5[a] !== $t ? lt.html5[a] && !i(a) : (t = "audio/" + a,
            e = lt.html5.canPlayType({
                type: t
            }),
            (lt.html5[a] = e) && lt.html5[t] && !i(t))
        }
        ,
        Z = function() {
            function t(t) {
                var e, a = e = !1;
                if (!o || "function" != typeof o.canPlayType)
                    return e;
                if (t instanceof Array) {
                    for (i = 0,
                    e = t.length; i < e; i++)
                        (lt.html5[t[i]] || o.canPlayType(t[i]).match(lt.html5Test)) && (a = !0,
                        lt.html5[t[i]] = !0,
                        lt.flash[t[i]] = !!t[i].match(Vt));
                    e = a
                } else
                    e = !(!(t = !(!o || "function" != typeof o.canPlayType) && o.canPlayType(t)) || !t.match(lt.html5Test));
                return e
            }
            if (!lt.useHTML5Audio || !lt.hasHTML5)
                return Dt = lt.html5.usingFlash = !0,
                !1;
            var e, a, n, i, o = Audio !== $t ? Rt && opera.version() < 10 ? new Audio(null) : new Audio : null, s = {};
            for (e in n = lt.audioFormats)
                if (n.hasOwnProperty(e) && (a = "audio/" + e,
                s[e] = t(n[e].type),
                s[a] = s[e],
                e.match(Vt) ? (lt.flash[e] = !0,
                lt.flash[a] = !0) : (lt.flash[e] = !1,
                lt.flash[a] = !1),
                n[e] && n[e].related))
                    for (i = n[e].related.length - 1; 0 <= i; i--)
                        s["audio/" + n[e].related[i]] = s[e],
                        lt.html5[n[e].related[i]] = s[e],
                        lt.flash[n[e].related[i]] = s[e];
            return s.canPlayType = o ? t : null,
            lt.html5 = v(lt.html5, s),
            lt.html5.usingFlash = z(),
            Dt = lt.html5.usingFlash,
            !0
        }
        ,
        M = {},
        x = function() {}
        ,
        H = function(t) {
            return 8 === y && 1 < t.loops && t.stream && (t.stream = !1),
            t
        }
        ,
        F = function(t, e) {
            return t && !t.usePolicyFile && (t.onid3 || t.usePeakData || t.useWaveformData || t.useEQData) && (t.usePolicyFile = !0),
            t
        }
        ,
        n = function() {
            return !1
        }
        ,
        E = function(t) {
            for (var e in t)
                t.hasOwnProperty(e) && "function" == typeof t[e] && (t[e] = n)
        }
        ,
        A = function(t) {
            t === $t && (t = !1),
            (vt || t) && lt.disable(t)
        }
        ,
        N = function(t) {
            if (t)
                if (t.match(/\.swf(\?.*)?$/i)) {
                    if (t.substr(t.toLowerCase().lastIndexOf(".swf?") + 4))
                        return t
                } else
                    t.lastIndexOf("/") !== t.length - 1 && (t += "/");
            return t = (t && -1 !== t.lastIndexOf("/") ? t.substr(0, t.lastIndexOf("/") + 1) : "./") + lt.movieURL,
            lt.noSWFCache && (t += "?ts=" + (new Date).getTime()),
            t
        }
        ,
        S = function() {
            8 !== (y = parseInt(lt.flashVersion, 10)) && 9 !== y && (lt.flashVersion = y = 8);
            var t = lt.debugMode || lt.debugFlash ? "_debug.swf" : ".swf";
            lt.useHTML5Audio && !lt.html5Only && lt.audioFormats.mp4.required && y < 9 && (lt.flashVersion = y = 9),
            lt.version = lt.versionNumber + (lt.html5Only ? " (HTML5-only mode)" : 9 === y ? " (AS3/Flash 9)" : " (AS2/Flash 8)"),
            lt.features.movieStar = 8 < y && (lt.defaultOptions = v(lt.defaultOptions, lt.flash9Options),
            lt.features.buffering = !0,
            lt.defaultOptions = v(lt.defaultOptions, lt.movieStarOptions),
            lt.filePatterns.flash9 = new RegExp("\\.(mp3|" + Xt.join("|") + ")(\\?.*)?$","i"),
            !0),
            lt.filePattern = lt.filePatterns[8 !== y ? "flash9" : "flash8"],
            lt.movieURL = (8 === y ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", t),
            lt.features.peakData = lt.features.waveformData = lt.features.eqData = 8 < y
        }
        ,
        I = function(t, e) {
            dt && dt._setPolling(t, e)
        }
        ,
        B = this.getSoundById,
        R = function() {
            var t = [];
            return lt.debugMode && t.push("sm2_debug"),
            lt.debugFlash && t.push("flash_debug"),
            lt.useHighPerformance && t.push("high_performance"),
            t.join(" ")
        }
        ,
        k = function() {
            x("fbHandler");
            var t = lt.getMoviePercent()
              , e = {
                type: "FLASHBLOCK"
            };
            lt.html5Only || (lt.ok() ? lt.oMC && (lt.oMC.className = [R(), "movieContainer", "swf_loaded" + (lt.didFlashBlock ? " swf_unblocked" : "")].join(" ")) : (Dt && (lt.oMC.className = R() + " movieContainer " + (null === t ? "swf_timedout" : "swf_error")),
            lt.didFlashBlock = !0,
            f({
                type: "ontimeout",
                ignoreInit: !0,
                error: e
            }),
            L(e)))
        }
        ,
        d = function(t, e, a) {
            mt[t] === $t && (mt[t] = []),
            mt[t].push({
                method: e,
                scope: a || null,
                fired: !1
            })
        }
        ,
        f = function(t) {
            if (t || (t = {
                type: lt.ok() ? "onready" : "ontimeout"
            }),
            !yt && t && !t.ignoreInit || "ontimeout" === t.type && (lt.ok() || vt && !t.ignoreInit))
                return !1;
            var e, a = {
                success: t && t.ignoreInit ? lt.ok() : !vt
            }, n = t && t.type && mt[t.type] || [], i = [], o = (a = [a],
            Dt && !lt.ok());
            for (t.error && (a[0].error = t.error),
            t = 0,
            e = n.length; t < e; t++)
                !0 !== n[t].fired && i.push(n[t]);
            if (i.length)
                for (t = 0,
                e = i.length; t < e; t++)
                    i[t].scope ? i[t].method.apply(i[t].scope, a) : i[t].method.apply(this, a),
                    o || (i[t].fired = !0);
            return !0
        }
        ,
        m = function() {
            Yt.setTimeout(function() {
                lt.useFlashBlock && k(),
                f(),
                "function" == typeof lt.onload && lt.onload.apply(Yt),
                lt.waitForWindowLoad && J.add(Yt, "load", m)
            }, 1)
        }
        ,
        at = function() {
            if (et !== $t)
                return et;
            var e, a, t = !1, n = navigator, i = Yt.ActiveXObject;
            try {
                a = n.plugins
            } catch (t) {
                a = void 0
            }
            if (a && a.length)
                (n = n.mimeTypes) && n["application/x-shockwave-flash"] && n["application/x-shockwave-flash"].enabledPlugin && n["application/x-shockwave-flash"].enabledPlugin.description && (t = !0);
            else if (i !== $t && !ct.match(/MSAppHost/i)) {
                try {
                    e = new i("ShockwaveFlash.ShockwaveFlash")
                } catch (t) {
                    e = null
                }
                t = !!e
            }
            return et = t
        }
        ,
        z = function() {
            var t, e, a = lt.audioFormats;
            if (Et && ct.match(/os (1|2|3_0|3_1)\s/i) ? (lt.hasHTML5 = !1,
            lt.html5Only = !0,
            lt.oMC && (lt.oMC.style.display = "none")) : !lt.useHTML5Audio || lt.html5 && lt.html5.canPlayType || (lt.hasHTML5 = !1),
            lt.useHTML5Audio && lt.hasHTML5)
                for (e in W = !0,
                a)
                    a.hasOwnProperty(e) && a[e].required && (lt.html5.canPlayType(a[e].type) ? lt.preferFlash && (lt.flash[e] || lt.flash[a[e].type]) && (t = !0) : t = !(W = !1));
            return lt.ignoreFlash && (W = !(t = !1)),
            lt.html5Only = lt.hasHTML5 && lt.useHTML5Audio && !t,
            !lt.html5Only
        }
        ,
        q = function(t) {
            var e, a, n = 0;
            if (t instanceof Array) {
                for (e = 0,
                a = t.length; e < a; e++)
                    if (t[e]instanceof Object) {
                        if (lt.canPlayMIME(t[e].type)) {
                            n = e;
                            break
                        }
                    } else if (lt.canPlayURL(t[e])) {
                        n = e;
                        break
                    }
                t[n].url && (t[n] = t[n].url),
                t = t[n]
            }
            return t
        }
        ,
        j = function(t) {
            t._hasTimer || (t._hasTimer = !0,
            !Ht && lt.html5PollingInterval && (null === Ct && 0 === wt && (Ct = setInterval(V, lt.html5PollingInterval)),
            wt++))
        }
        ,
        U = function(t) {
            t._hasTimer && (t._hasTimer = !1,
            !Ht && lt.html5PollingInterval && wt--)
        }
        ,
        V = function() {
            var t;
            if (null === Ct || wt)
                for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                    lt.sounds[lt.soundIDs[t]].isHTML5 && lt.sounds[lt.soundIDs[t]]._hasTimer && lt.sounds[lt.soundIDs[t]]._onTimer();
            else
                clearInterval(Ct),
                Ct = null
        }
        ,
        L = function(t) {
            t = t !== $t ? t : {},
            "function" == typeof lt.onerror && lt.onerror.apply(Yt, [{
                type: t.type !== $t ? t.type : null
            }]),
            t.fatal !== $t && t.fatal && lt.disable()
        }
        ,
        nt = function() {
            if (Ft && at()) {
                var t, e, a = lt.audioFormats;
                for (e in a)
                    if (a.hasOwnProperty(e) && ("mp3" === e || "mp4" === e) && (lt.html5[e] = !1,
                    a[e] && a[e].related))
                        for (t = a[e].related.length - 1; 0 <= t; t--)
                            lt.html5[a[e].related[t]] = !1
            }
        }
        ,
        this._setSandboxType = function(t) {}
        ,
        this._externalInterfaceOK = function(t) {
            lt.swfLoaded || (lt.swfLoaded = !0,
            jt = !1,
            Ft && nt(),
            setTimeout(h, Nt ? 100 : 1))
        }
        ,
        P = function(t, e) {
            function a(t, e) {
                return '<param name="' + t + '" value="' + e + '" />'
            }
            if (pt && gt)
                return !1;
            if (lt.html5Only)
                return S(),
                lt.oMC = c(lt.movieID),
                h(),
                gt = pt = !0,
                !1;
            var n, i, o, s = e || lt.url, r = lt.altURL || s, l = D(), u = R(), d = null;
            d = (d = ft.getElementsByTagName("html")[0]) && d.dir && d.dir.match(/rtl/i);
            if (t = t === $t ? lt.id : t,
            S(),
            lt.url = N(qt ? s : r),
            e = lt.url,
            lt.wmode = !lt.wmode && lt.useHighPerformance ? "transparent" : lt.wmode,
            null !== lt.wmode && (ct.match(/msie 8/i) || !Nt && !lt.useHighPerformance) && navigator.platform.match(/win32|win64/i) && (Ot.push(M.spcWmode),
            lt.wmode = null),
            l = {
                name: t,
                id: t,
                src: e,
                quality: "high",
                allowScriptAccess: lt.allowScriptAccess,
                bgcolor: lt.bgColor,
                pluginspage: Wt + "www.macromedia.com/go/getflashplayer",
                title: "JS/Flash audio component (SoundManager 2)",
                type: "application/x-shockwave-flash",
                wmode: lt.wmode,
                hasPriority: "true"
            },
            lt.debugFlash && (l.FlashVars = "debug=1"),
            lt.wmode || delete l.wmode,
            Nt)
                s = ft.createElement("div"),
                i = ['<object id="' + t + '" data="' + e + '" type="' + l.type + '" title="' + l.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">', a("movie", e), a("AllowScriptAccess", lt.allowScriptAccess), a("quality", l.quality), lt.wmode ? a("wmode", lt.wmode) : "", a("bgcolor", lt.bgColor), a("hasPriority", "true"), lt.debugFlash ? a("FlashVars", l.FlashVars) : "", "</object>"].join("");
            else
                for (n in s = ft.createElement("embed"),
                l)
                    l.hasOwnProperty(n) && s.setAttribute(n, l[n]);
            if (u = R(),
            l = D())
                if (lt.oMC = c(lt.movieID) || ft.createElement("div"),
                lt.oMC.id)
                    o = lt.oMC.className,
                    lt.oMC.className = (o ? o + " " : "movieContainer") + (u ? " " + u : ""),
                    lt.oMC.appendChild(s),
                    Nt && ((n = lt.oMC.appendChild(ft.createElement("div"))).className = "sm2-object-box",
                    n.innerHTML = i),
                    gt = !0;
                else {
                    if (lt.oMC.id = lt.movieID,
                    lt.oMC.className = "movieContainer " + u,
                    n = u = null,
                    lt.useFlashBlock || (lt.useHighPerformance ? u = {
                        position: "fixed",
                        width: "8px",
                        height: "8px",
                        bottom: "0px",
                        left: "0px",
                        overflow: "hidden"
                    } : (u = {
                        position: "absolute",
                        width: "6px",
                        height: "6px",
                        top: "-9999px",
                        left: "-9999px"
                    },
                    d && (u.left = Math.abs(parseInt(u.left, 10)) + "px"))),
                    xt && (lt.oMC.style.zIndex = 1e4),
                    !lt.debugFlash)
                        for (o in u)
                            u.hasOwnProperty(o) && (lt.oMC.style[o] = u[o]);
                    try {
                        Nt || lt.oMC.appendChild(s),
                        l.appendChild(lt.oMC),
                        Nt && ((n = lt.oMC.appendChild(ft.createElement("div"))).className = "sm2-object-box",
                        n.innerHTML = i),
                        gt = !0
                    } catch (t) {
                        throw Error(x("domError") + " \n" + t.toString())
                    }
                }
            return pt = !0
        }
        ,
        T = function() {
            return lt.html5Only ? (P(),
            !1) : !(dt || !lt.url) && ((dt = lt.getMovie(lt.id)) || (St ? (Nt ? lt.oMC.innerHTML = bt : lt.oMC.appendChild(St),
            pt = !(St = null)) : P(lt.id, lt.url),
            dt = lt.getMovie(lt.id)),
            "function" == typeof lt.oninitmovie && setTimeout(lt.oninitmovie, 1),
            !0)
        }
        ,
        p = function() {
            setTimeout(g, 1e3)
        }
        ,
        _ = function() {
            Yt.setTimeout(function() {
                lt.setup({
                    preferFlash: !1
                }).reboot(),
                lt.didFlashBlock = !0,
                lt.beginDelayedInit()
            }, 1)
        }
        ,
        g = function() {
            var t, e = !1;
            lt.url && !Mt && (Mt = !0,
            J.remove(Yt, "load", p),
            et && jt && !Bt || (yt || 0 < (t = lt.getMoviePercent()) && t < 100 && (e = !0),
            setTimeout(function() {
                t = lt.getMoviePercent(),
                e ? (Mt = !1,
                Yt.setTimeout(p, 1)) : !yt && Ut && (null === t ? lt.useFlashBlock || 0 === lt.flashLoadTimeout ? lt.useFlashBlock && k() : !lt.useFlashBlock && W ? _() : f({
                    type: "ontimeout",
                    ignoreInit: !0,
                    error: {
                        type: "INIT_FLASHBLOCK"
                    }
                }) : 0 !== lt.flashLoadTimeout && (!lt.useFlashBlock && W ? _() : A(!0)))
            }, lt.flashLoadTimeout)))
        }
        ,
        b = function() {
            return Bt || !jt || (Bt = Ut = !0,
            Mt = !1,
            p()),
            J.remove(Yt, "focus", b),
            !0
        }
        ,
        r = function(t) {
            if (yt)
                return !1;
            if (lt.html5Only)
                return yt = !0,
                m(),
                !0;
            var e, a = !0;
            return lt.useFlashBlock && lt.flashLoadTimeout && !lt.getMoviePercent() || (yt = !0),
            e = {
                type: !et && Dt ? "NO_FLASH" : "INIT_TIMEOUT"
            },
            (vt || t) && (lt.useFlashBlock && lt.oMC && (lt.oMC.className = R() + " " + (null === lt.getMoviePercent() ? "swf_timedout" : "swf_error")),
            f({
                type: "ontimeout",
                error: e,
                ignoreInit: !0
            }),
            L(e),
            a = !1),
            vt || (lt.waitForWindowLoad && !_t ? J.add(Yt, "load", m) : m()),
            a
        }
        ,
        s = function() {
            var t, e = lt.setupOptions;
            for (t in e)
                e.hasOwnProperty(t) && (lt[t] === $t ? lt[t] = e[t] : lt[t] !== e[t] && (lt.setupOptions[t] = lt[t]))
        }
        ,
        h = function() {
            if (yt)
                return !1;
            if (lt.html5Only)
                return yt || (J.remove(Yt, "load", lt.beginDelayedInit),
                lt.enabled = !0,
                r()),
                !0;
            T();
            try {
                dt._externalInterfaceTest(!1),
                I(!0, lt.flashPollingInterval || (lt.useHighPerformance ? 10 : 50)),
                lt.debugMode || dt._disableDebug(),
                lt.enabled = !0,
                lt.html5Only || J.add(Yt, "unload", n)
            } catch (t) {
                return L({
                    type: "JS_TO_FLASH_EXCEPTION",
                    fatal: !0
                }),
                A(!0),
                r(),
                !1
            }
            return r(),
            J.remove(Yt, "load", lt.beginDelayedInit),
            !0
        }
        ,
        w = function() {
            return !O && (O = !0,
            s(),
            !et && lt.hasHTML5 && lt.setup({
                useHTML5Audio: !0,
                preferFlash: !1
            }),
            Z(),
            !et && Dt && (Ot.push(M.needFlash),
            lt.setup({
                flashLoadTimeout: 1
            })),
            ft.removeEventListener && ft.removeEventListener("DOMContentLoaded", w, !1),
            T(),
            !0)
        }
        ,
        K = function() {
            return "complete" === ft.readyState && (w(),
            ft.detachEvent("onreadystatechange", K)),
            !0
        }
        ,
        C = function() {
            _t = !0,
            w(),
            J.remove(Yt, "load", C)
        }
        ,
        at(),
        J.add(Yt, "focus", b),
        J.add(Yt, "load", p),
        J.add(Yt, "load", C),
        ft.addEventListener ? ft.addEventListener("DOMContentLoaded", w, !1) : ft.attachEvent ? ft.attachEvent("onreadystatechange", K) : L({
            type: "NO_DOM2_EVENTS",
            fatal: !0
        })
    }
    if (!Yt || !Yt.document)
        throw Error("SoundManager requires a browser with window and document objects.");
    var t = null;
    Yt.SM2_DEFER !== $t && SM2_DEFER || (t = new e),
    "object" == typeof module && module && "object" == typeof module.exports ? (module.exports.SoundManager = e,
    module.exports.soundManager = t) : "function" == typeof define && define.amd && define(function() {
        return {
            constructor: e,
            getInstance: function(t) {
                return !Yt.soundManager && t instanceof Function && ((t = t(e))instanceof e && (Yt.soundManager = t)),
                Yt.soundManager
            }
        }
    }),
    Yt.SoundManager = e,
    Yt.soundManager = t
}(window),
function(T) {
    function t() {
        var v = this
          , e = this
          , _ = soundManager
          , t = navigator.userAgent
          , S = t.match(/msie/i)
          , h = t.match(/opera/i)
          , f = t.match(/safari/i)
          , a = t.match(/chrome/i)
          , b = t.match(/ipad|iphone/i)
          , n = void 0 === T.G_vmlCanvasManager && void 0 !== document.createElement("canvas").getContext("2d")
          , l = h || a ? 359.9 : 360
          , M = navigator.userAgent.match(/msie [678]/i) ? 1 : 2;
        this.excludeClass = "threesixty-exclude",
        this.links = [],
        this.sounds = [],
        this.soundsByURL = [],
        this.indexByURL = [],
        this.lastSound = null,
        this.lastTouchedSound = null,
        this.soundCount = 0,
        this.oUITemplate = null,
        this.oUIImageMap = null,
        this.vuMeter = null,
        this.callbackCount = 0,
        this.peakDataHistory = [],
        this.config = {
            playNext: !1,
            autoPlay: !1,
            allowMultiple: !1,
            loadRingColor: "#ccc",
            playRingColor: "#000",
            backgroundRingColor: "#eee",
            segmentRingColor: "rgba(255,255,255,0.33)",
            segmentRingColorAlt: "rgba(0,0,0,0.1)",
            loadRingColorMetadata: "#ddd",
            playRingColorMetadata: "rgba(128,192,256,0.9)",
            circleDiameter: null,
            circleRadius: null,
            animDuration: 500,
            animTransition: T.Animator.tx.bouncy,
            showHMSTime: !1,
            scaleFont: !0,
            useWaveformData: !1,
            waveformDataColor: "#0099ff",
            waveformDataDownsample: 3,
            waveformDataOutside: !1,
            waveformDataConstrain: !1,
            waveformDataLineRatio: .64,
            useEQData: !1,
            eqDataColor: "#339933",
            eqDataDownsample: 4,
            eqDataOutside: !0,
            eqDataLineRatio: .54,
            usePeakData: !0,
            peakDataColor: "#ff33ff",
            peakDataOutside: !0,
            peakDataLineRatio: .5,
            useAmplifier: !0,
            fontSizeMax: null,
            scaleArcWidth: 1,
            useFavIcon: !1
        },
        this.css = {
            sDefault: "sm2_link",
            sBuffering: "sm2_buffering",
            sPlaying: "sm2_playing",
            sPaused: "sm2_paused"
        },
        this.addEventHandler = void 0 !== T.addEventListener ? function(t, e, a) {
            return t.addEventListener(e, a, !1)
        }
        : function(t, e, a) {
            t.attachEvent("on" + e, a)
        }
        ,
        this.removeEventHandler = void 0 !== T.removeEventListener ? function(t, e, a) {
            return t.removeEventListener(e, a, !1)
        }
        : function(t, e, a) {
            return t.detachEvent("on" + e, a)
        }
        ,
        this.hasClass = function(t, e) {
            return void 0 !== t.className && t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"))
        }
        ,
        this.addClass = function(t, e) {
            t && e && !v.hasClass(t, e) && (t.className = (t.className ? t.className + " " : "") + e)
        }
        ,
        this.removeClass = function(t, e) {
            t && e && v.hasClass(t, e) && (t.className = t.className.replace(new RegExp("( " + e + ")|(" + e + ")","g"), ""))
        }
        ,
        this.getElementsByClassName = function(t, e, a) {
            var n, i, o = a || document, s = [], r = [];
            if (void 0 !== e && "string" != typeof e)
                for (n = e.length; n--; )
                    r && r[e[n]] || (r[e[n]] = o.getElementsByTagName(e[n]));
            else
                r = e ? o.getElementsByTagName(e) : o.all || o.getElementsByTagName("*");
            if ("string" != typeof e)
                for (n = e.length; n--; )
                    for (i = r[e[n]].length; i--; )
                        v.hasClass(r[e[n]][i], t) && s.push(r[e[n]][i]);
            else
                for (n = 0; n < r.length; n++)
                    v.hasClass(r[n], t) && s.push(r[n]);
            return s
        }
        ,
        this.getParentByNodeName = function(t, e) {
            if (!t || !e)
                return !1;
            for (e = e.toLowerCase(); t.parentNode && e !== t.parentNode.nodeName.toLowerCase(); )
                t = t.parentNode;
            return t.parentNode && e === t.parentNode.nodeName.toLowerCase() ? t.parentNode : null
        }
        ,
        this.getParentByClassName = function(t, e) {
            if (!t || !e)
                return null;
            for (; t.parentNode && !v.hasClass(t.parentNode, e); )
                t = t.parentNode;
            return t.parentNode && v.hasClass(t.parentNode, e) ? t.parentNode : null
        }
        ,
        this.getSoundByURL = function(t) {
            return void 0 !== v.soundsByURL[t] ? v.soundsByURL[t] : null
        }
        ,
        this.isChildOfNode = function(t, e) {
            if (!t || !t.parentNode)
                return !1;
            for (e = e.toLowerCase(); (t = t.parentNode) && t.parentNode && t.nodeName.toLowerCase() !== e; )
                ;
            return t && t.nodeName.toLowerCase() === e ? t : null
        }
        ,
        this.isChildOfClass = function(t, e) {
            if (!t || !e)
                return !1;
            for (; t.parentNode && !v.hasClass(t, e); )
                t = v.findParent(t);
            return v.hasClass(t, e)
        }
        ,
        this.findParent = function(t) {
            if (!t || !t.parentNode)
                return !1;
            if (2 === (t = t.parentNode).nodeType)
                for (; t && t.parentNode && 2 === t.parentNode.nodeType; )
                    t = t.parentNode;
            return t
        }
        ,
        this.getStyle = function(t, e) {
            try {
                if (t.currentStyle)
                    return t.currentStyle[e];
                if (T.getComputedStyle)
                    return document.defaultView.getComputedStyle(t, null).getPropertyValue(e)
            } catch (t) {}
            return null
        }
        ,
        this.findXY = function(t) {
            for (var e = 0, a = 0; e += t.offsetLeft,
            a += t.offsetTop,
            t = t.offsetParent; )
                ;
            return [e, a]
        }
        ,
        this.getMouseXY = function(t) {
            return t = t || T.event,
            b && t.touches && (t = t.touches[0]),
            t.pageX || t.pageY ? [t.pageX, t.pageY] : t.clientX || t.clientY ? [t.clientX + v.getScrollLeft(), t.clientY + v.getScrollTop()] : [void 0, void 0]
        }
        ,
        this.getScrollLeft = function() {
            return document.body.scrollLeft + document.documentElement.scrollLeft
        }
        ,
        this.getScrollTop = function() {
            return document.body.scrollTop + document.documentElement.scrollTop
        }
        ,
        this.events = {
            play: function() {
                e.removeClass(this._360data.oUIBox, this._360data.className),
                this._360data.className = e.css.sPlaying,
                e.addClass(this._360data.oUIBox, this._360data.className),
                v.fanOut(this)
            },
            stop: function() {
                e.removeClass(this._360data.oUIBox, this._360data.className),
                this._360data.className = "",
                v.fanIn(this)
            },
            pause: function() {
                e.removeClass(this._360data.oUIBox, this._360data.className),
                this._360data.className = e.css.sPaused,
                e.addClass(this._360data.oUIBox, this._360data.className)
            },
            resume: function() {
                e.removeClass(this._360data.oUIBox, this._360data.className),
                this._360data.className = e.css.sPlaying,
                e.addClass(this._360data.oUIBox, this._360data.className)
            },
            finish: function() {
                var t;
                e.removeClass(this._360data.oUIBox, this._360data.className),
                this._360data.className = "",
                this._360data.didFinish = !0,
                v.fanIn(this),
                e.config.playNext && (t = e.indexByURL[this._360data.oLink.href] + 1) < e.links.length && e.handleClick({
                    target: e.links[t]
                })
            },
            whileloading: function() {
                this.paused && v.updatePlaying.apply(this)
            },
            whileplaying: function() {
                v.updatePlaying.apply(this),
                this._360data.fps++
            },
            bufferchange: function() {
                this.isBuffering ? e.addClass(this._360data.oUIBox, e.css.sBuffering) : e.removeClass(this._360data.oUIBox, e.css.sBuffering)
            }
        },
        this.stopEvent = function(t) {
            return void 0 !== t && void 0 !== t.preventDefault ? t.preventDefault() : void 0 !== T.event && void 0 !== T.event.returnValue && (T.event.returnValue = !1),
            !1
        }
        ,
        this.getTheDamnLink = S ? function(t) {
            return t && t.target ? t.target : T.event.srcElement
        }
        : function(t) {
            return t.target
        }
        ,
        this.handleClick = function(t) {
            if (1 < t.button)
                return !0;
            var e, a, n, i, o, s, r = v.getTheDamnLink(t);
            return "a" !== r.nodeName.toLowerCase() && !(r = v.isChildOfNode(r, "a")) || (!v.isChildOfClass(r, "ui360") || (!(r.href && _.canPlayLink(r) && !v.hasClass(r, v.excludeClass)) || (_._writeDebug("handleClick()"),
            a = r.href,
            (n = v.getSoundByURL(a)) ? n === v.lastSound ? n.togglePause() : (n.togglePause(),
            _._writeDebug("sound different than last sound: " + v.lastSound.id),
            !v.config.allowMultiple && v.lastSound && v.stopSound(v.lastSound)) : (i = r.parentNode,
            o = v.getElementsByClassName("ui360-vis", "div", i.parentNode).length,
            n = _.createSound({
                id: "ui360Sound" + v.soundCount++,
                url: a,
                onplay: v.events.play,
                onstop: v.events.stop,
                onpause: v.events.pause,
                onresume: v.events.resume,
                onfinish: v.events.finish,
                onbufferchange: v.events.bufferchange,
                type: r.type || null,
                whileloading: v.events.whileloading,
                whileplaying: v.events.whileplaying,
                useWaveformData: o && v.config.useWaveformData,
                useEQData: o && v.config.useEQData,
                usePeakData: o && v.config.usePeakData
            }),
            s = parseInt(v.getElementsByClassName("sm2-360ui", "div", i)[0].offsetWidth * M, 10),
            e = v.getElementsByClassName("sm2-canvas", "canvas", i),
            n._360data = {
                oUI360: v.getParentByClassName(r, "ui360"),
                oLink: r,
                className: v.css.sPlaying,
                oUIBox: v.getElementsByClassName("sm2-360ui", "div", i)[0],
                oCanvas: e[e.length - 1],
                oButton: v.getElementsByClassName("sm2-360btn", "span", i)[0],
                oTiming: v.getElementsByClassName("sm2-timing", "div", i)[0],
                oCover: v.getElementsByClassName("sm2-cover", "div", i)[0],
                circleDiameter: s,
                circleRadius: s / 2,
                lastTime: null,
                didFinish: null,
                pauseCount: 0,
                radius: 0,
                fontSize: 1,
                fontSizeMax: v.config.fontSizeMax,
                scaleFont: o && v.config.scaleFont,
                showHMSTime: o,
                amplifier: o && v.config.usePeakData ? .9 : 1,
                radiusMax: .175 * s,
                width: 0,
                widthMax: .4 * s,
                lastValues: {
                    bytesLoaded: 0,
                    bytesTotal: 0,
                    position: 0,
                    durationEstimate: 0
                },
                animating: !1,
                oAnim: new T.Animator({
                    duration: v.config.animDuration,
                    transition: v.config.animTransition,
                    onComplete: function() {}
                }),
                oAnimProgress: function(t) {
                    var e = this;
                    e._360data.radius = parseInt(e._360data.radiusMax * e._360data.amplifier * t, 10),
                    e._360data.width = parseInt(e._360data.widthMax * e._360data.amplifier * t, 10),
                    e._360data.scaleFont && null !== e._360data.fontSizeMax && (e._360data.oTiming.style.fontSize = parseInt(Math.max(1, e._360data.fontSizeMax * t), 10) + "px",
                    e._360data.oTiming.style.opacity = t),
                    (e.paused || 0 === e.playState || 0 === e._360data.lastValues.bytesLoaded || 0 === e._360data.lastValues.position) && v.updatePlaying.apply(e)
                },
                fps: 0
            },
            void 0 !== v.Metadata && v.getElementsByClassName("metadata", "div", n._360data.oUI360).length && (n._360data.metadata = new v.Metadata(n,v)),
            n._360data.scaleFont && null !== n._360data.fontSizeMax && (n._360data.oTiming.style.fontSize = "1px"),
            n._360data.oAnim.addSubject(n._360data.oAnimProgress, n),
            v.refreshCoords(n),
            v.updatePlaying.apply(n),
            v.soundsByURL[a] = n,
            v.sounds.push(n),
            !v.config.allowMultiple && v.lastSound && v.stopSound(v.lastSound),
            n.play()),
            v.lastSound = n,
            void 0 !== t && void 0 !== t.preventDefault ? t.preventDefault() : void 0 !== T.event && (T.event.returnValue = !1),
            !1)))
        }
        ,
        this.fanOut = function(t) {
            var e = t;
            1 !== e._360data.animating && (e._360data.animating = 0,
            soundManager._writeDebug("fanOut: " + e.id + ": " + e._360data.oLink.href),
            e._360data.oAnim.seekTo(1),
            T.setTimeout(function() {
                e._360data.animating = 0
            }, v.config.animDuration + 20))
        }
        ,
        this.fanIn = function(t) {
            var e = t;
            -1 !== e._360data.animating && (e._360data.animating = -1,
            soundManager._writeDebug("fanIn: " + e.id + ": " + e._360data.oLink.href),
            e._360data.oAnim.seekTo(0),
            T.setTimeout(function() {
                e._360data.didFinish = !1,
                e._360data.animating = 0,
                v.resetLastValues(e)
            }, v.config.animDuration + 20))
        }
        ,
        this.resetLastValues = function(t) {
            t._360data.lastValues.position = 0
        }
        ,
        this.refreshCoords = function(t) {
            t._360data.canvasXY = v.findXY(t._360data.oCanvas),
            t._360data.canvasMid = [t._360data.circleRadius, t._360data.circleRadius],
            t._360data.canvasMidXY = [t._360data.canvasXY[0] + t._360data.canvasMid[0], t._360data.canvasXY[1] + t._360data.canvasMid[1]]
        }
        ,
        this.stopSound = function(t) {
            soundManager._writeDebug("stopSound: " + t.id),
            soundManager.stop(t.id),
            b || soundManager.unload(t.id)
        }
        ,
        this.buttonClick = function(t) {
            var e = t ? t.target ? t.target : t.srcElement : T.event.srcElement;
            return v.handleClick({
                target: v.getParentByClassName(e, "sm2-360ui").nextSibling
            }),
            !1
        }
        ,
        this.buttonMouseDown = function(t) {
            return b ? v.addEventHandler(document, "touchmove", v.mouseDown) : document.onmousemove = function(t) {
                v.mouseDown(t)
            }
            ,
            v.stopEvent(t),
            !1
        }
        ,
        this.mouseDown = function(t) {
            if (!b && 1 < t.button)
                return !0;
            if (!v.lastSound)
                return v.stopEvent(t),
                !1;
            var e, a, n, i = t || T.event;
            return b && i.touches && (i = i.touches[0]),
            e = i.target || i.srcElement,
            a = v.getSoundByURL(v.getElementsByClassName("sm2_link", "a", v.getParentByClassName(e, "ui360"))[0].href),
            v.lastTouchedSound = a,
            v.refreshCoords(a),
            n = a._360data,
            v.addClass(n.oUIBox, "sm2_dragging"),
            n.pauseCount = v.lastTouchedSound.paused ? 1 : 0,
            v.mmh(t || T.event),
            b ? (v.removeEventHandler(document, "touchmove", v.mouseDown),
            v.addEventHandler(document, "touchmove", v.mmh),
            v.addEventHandler(document, "touchend", v.mouseUp)) : (document.onmousemove = v.mmh,
            document.onmouseup = v.mouseUp),
            v.stopEvent(t),
            !1
        }
        ,
        this.mouseUp = function() {
            var t = v.lastTouchedSound._360data;
            v.removeClass(t.oUIBox, "sm2_dragging"),
            0 === t.pauseCount && v.lastTouchedSound.resume(),
            b ? (v.removeEventHandler(document, "touchmove", v.mmh),
            v.removeEventHandler(document, "touchend", v.mouseUP)) : (document.onmousemove = null,
            document.onmouseup = null)
        }
        ,
        this.mmh = function(t) {
            void 0 === t && (t = T.event);
            var e = v.lastTouchedSound
              , a = v.getMouseXY(t)
              , n = a[0]
              , i = a[1]
              , o = n - e._360data.canvasMidXY[0]
              , s = i - e._360data.canvasMidXY[1]
              , r = Math.floor(l - (v.rad2deg(Math.atan2(o, s)) + 180));
            return e.setPosition(e.durationEstimate * (r / l)),
            v.stopEvent(t),
            !1
        }
        ,
        this.drawSolidArc = function(t, e, a, n, i, o, s) {
            var r, l, u, d, c = t;
            c.getContext && (r = c.getContext("2d")),
            t = r,
            s || v.clearCanvas(c),
            e && (r.fillStyle = e),
            t.beginPath(),
            isNaN(i) && (i = 0),
            l = a - n,
            (!(u = h || f) || u && 0 < a) && (t.arc(0, 0, a, o, i, !1),
            d = v.getArcEndpointCoords(l, i),
            t.lineTo(d.x, d.y),
            t.arc(0, 0, l, i, o, !0),
            t.closePath(),
            t.fill())
        }
        ,
        this.getArcEndpointCoords = function(t, e) {
            return {
                x: t * Math.cos(e),
                y: t * Math.sin(e)
            }
        }
        ,
        this.deg2rad = function(t) {
            return t * (Math.PI / 180)
        }
        ,
        this.rad2deg = function(t) {
            return t * (180 / Math.PI)
        }
        ,
        this.getTime = function(t, e) {
            var a = Math.floor(t / 1e3)
              , n = Math.floor(a / 60)
              , i = a - 60 * n;
            return e ? n + ":" + (i < 10 ? "0" + i : i) : {
                min: n,
                sec: i
            }
        }
        ,
        this.clearCanvas = function(t) {
            var e, a, n = t, i = null;
            n.getContext && (i = n.getContext("2d")),
            i && (e = n.offsetWidth,
            a = n.offsetHeight,
            i.clearRect(-e / 2, -a / 2, e, a))
        }
        ,
        this.updatePlaying = function() {
            var t = this._360data.showHMSTime ? v.getTime(this.position, !0) : parseInt(this.position / 1e3, 10)
              , e = v.config.scaleArcWidth;
            this.bytesLoaded && (this._360data.lastValues.bytesLoaded = this.bytesLoaded,
            this._360data.lastValues.bytesTotal = this.bytesTotal),
            this.position && (this._360data.lastValues.position = this.position),
            this.durationEstimate && (this._360data.lastValues.durationEstimate = this.durationEstimate),
            v.drawSolidArc(this._360data.oCanvas, v.config.backgroundRingColor, this._360data.width, this._360data.radius * e, v.deg2rad(l), !1),
            v.drawSolidArc(this._360data.oCanvas, this._360data.metadata ? v.config.loadRingColorMetadata : v.config.loadRingColor, this._360data.width, this._360data.radius * e, v.deg2rad(l * (this._360data.lastValues.bytesLoaded / this._360data.lastValues.bytesTotal)), 0, !0),
            0 !== this._360data.lastValues.position && v.drawSolidArc(this._360data.oCanvas, this._360data.metadata ? v.config.playRingColorMetadata : v.config.playRingColor, this._360data.width, this._360data.radius * e, v.deg2rad(1 === this._360data.didFinish ? l : l * (this._360data.lastValues.position / this._360data.lastValues.durationEstimate)), 0, !0),
            this._360data.metadata && this._360data.metadata.events.whileplaying(),
            t !== this._360data.lastTime && (this._360data.lastTime = t,
            this._360data.oTiming.innerHTML = t),
            (this.instanceOptions.useWaveformData || this.instanceOptions.useEQData) && n && v.updateWaveform(this),
            v.config.useFavIcon && v.vuMeter && v.vuMeter.updateVU(this)
        }
        ,
        this.updateWaveform = function(t) {
            if ((v.config.useWaveformData || v.config.useEQData) && (_.features.waveformData || _.features.eqData) && (t.waveformData.left.length || t.eqData.length || t.peakData.left)) {
                var e, a, n, i, o, s, r, l, u, d, c, h, f = parseInt(t._360data.circleDiameter / 2, 10) / 2;
                if (v.config.useWaveformData)
                    for (n = v.config.waveformDataDownsample,
                    i = 256 / (n = Math.max(1, n)),
                    s = o = 0,
                    r = null,
                    l = v.config.waveformDataOutside ? 1 : v.config.waveformDataConstrain ? .5 : .565,
                    f = v.config.waveformDataOutside ? .7 : .75,
                    u = v.deg2rad(360 / i * v.config.waveformDataLineRatio),
                    e = 0; e < 256; e += n)
                        s = (o = v.deg2rad(e / i * (1 / n) * 360)) + u,
                        (r = t.waveformData.left[e]) < 0 && v.config.waveformDataConstrain && (r = Math.abs(r)),
                        v.drawSolidArc(t._360data.oCanvas, v.config.waveformDataColor, t._360data.width * l * (2 - v.config.scaleArcWidth), t._360data.radius * f * 1.25 * r, s, o, !0);
                if (v.config.useEQData)
                    for (n = v.config.eqDataDownsample,
                    i = (d = 192) / (n = Math.max(1, n)),
                    l = v.config.eqDataOutside ? 1 : .565,
                    a = v.config.eqDataOutside ? -1 : 1,
                    f = v.config.eqDataOutside ? .5 : .75,
                    s = o = 0,
                    u = v.deg2rad(360 / i * v.config.eqDataLineRatio),
                    c = v.deg2rad(1 === t._360data.didFinish ? 360 : t._360data.lastValues.position / t._360data.lastValues.durationEstimate * 360),
                    e = 0; e < d; e += n)
                        s = (o = v.deg2rad(e / d * 360)) + u,
                        v.drawSolidArc(t._360data.oCanvas, c < s ? v.config.eqDataColor : v.config.playRingColor, t._360data.width * l, t._360data.radius * f * (t.eqData.left[e] * a), s, o, !0);
                if (v.config.usePeakData && !t._360data.animating) {
                    for (h = t.peakData.left || t.peakData.right,
                    d = 3,
                    e = 0; e < d; e++)
                        h = h || t.eqData[e];
                    t._360data.amplifier = v.config.useAmplifier ? .9 + .1 * h : 1,
                    t._360data.radiusMax = .175 * t._360data.circleDiameter * t._360data.amplifier,
                    t._360data.widthMax = .4 * t._360data.circleDiameter * t._360data.amplifier,
                    t._360data.radius = parseInt(t._360data.radiusMax * t._360data.amplifier, 10),
                    t._360data.width = parseInt(t._360data.widthMax * t._360data.amplifier, 10)
                }
            }
        }
        ,
        this.getUIHTML = function(t) {
            return ['<canvas class="sm2-canvas" width="' + t + '" height="' + t + '"></canvas>', ' <span class="sm2-360btn sm2-360btn-default"></span>', ' <div class="sm2-timing' + (navigator.userAgent.match(/safari/i) ? " alignTweak" : "") + '"></div>', ' <div class="sm2-cover"></div>']
        }
        ,
        this.uiTest = function(t) {
            var e, a, n, i, o, s, r, l, u, d = document.createElement("div");
            return d.className = "sm2-360ui",
            (e = document.createElement("div")).className = "ui360" + (t ? " " + t : ""),
            a = e.appendChild(d.cloneNode(!0)),
            e.style.position = "absolute",
            e.style.left = "-9999px",
            n = document.body.appendChild(e),
            i = a.offsetWidth * M,
            o = v.getUIHTML(i),
            a.innerHTML = o[1] + o[2] + o[3],
            s = parseInt(i, 10),
            r = parseInt(s / 2, 10),
            u = v.getElementsByClassName("sm2-timing", "div", n)[0],
            l = parseInt(v.getStyle(u, "font-size"), 10),
            isNaN(l) && (l = null),
            e.parentNode.removeChild(e),
            o = e = a = n = null,
            {
                circleDiameter: s,
                circleRadius: r,
                fontSizeMax: l
            }
        }
        ,
        this.init = function() {
            _._writeDebug("threeSixtyPlayer.init()");
            var t, e, a, n, i, o, s, r, l, u, d, c, h, f, m = v.getElementsByClassName("ui360", "div"), p = [], g = !1, y = 0;
            for (t = 0,
            e = m.length; t < e; t++)
                p.push(m[t].getElementsByTagName("a")[0]),
                m[t].style.backgroundImage = "none";
            for (v.oUITemplate = document.createElement("div"),
            v.oUITemplate.className = "sm2-360ui",
            v.oUITemplateVis = document.createElement("div"),
            v.oUITemplateVis.className = "sm2-360ui",
            l = v.uiTest(),
            v.config.circleDiameter = l.circleDiameter,
            v.config.circleRadius = l.circleRadius,
            u = v.uiTest("ui360-vis"),
            v.config.fontSizeMax = u.fontSizeMax,
            v.oUITemplate.innerHTML = v.getUIHTML(v.config.circleDiameter).join(""),
            v.oUITemplateVis.innerHTML = v.getUIHTML(u.circleDiameter).join(""),
            t = 0,
            e = p.length; t < e; t++)
                !_.canPlayLink(p[t]) || v.hasClass(p[t], v.excludeClass) || v.hasClass(p[t], v.css.sDefault) || (v.addClass(p[t], v.css.sDefault),
                v.links[y] = p[t],
                v.indexByURL[p[t].href] = y,
                y++,
                s = ((g = v.hasClass(p[t].parentNode, "ui360-vis")) ? u : l).circleDiameter,
                r = (g ? u : l).circleRadius,
                d = p[t].parentNode.insertBefore((g ? v.oUITemplateVis : v.oUITemplate).cloneNode(!0), p[t]),
                S && void 0 !== T.G_vmlCanvasManager ? ((h = document.createElement("canvas")).className = "sm2-canvas",
                f = "sm2_canvas_" + t + (new Date).getTime(),
                h.id = f,
                h.width = s,
                h.height = s,
                d.appendChild(h),
                T.G_vmlCanvasManager.initElement(h),
                1 < (a = (n = document.getElementById(f)).parentNode.getElementsByTagName("canvas")).length && (n = a[a.length - 1])) : n = p[t].parentNode.getElementsByTagName("canvas")[0],
                1 < M && v.addClass(n, "hi-dpi"),
                o = v.getElementsByClassName("sm2-cover", "div", p[t].parentNode)[0],
                c = p[t].parentNode.getElementsByTagName("span")[0],
                v.addEventHandler(c, "click", v.buttonClick),
                b ? v.addEventHandler(o, "touchstart", v.mouseDown) : v.addEventHandler(o, "mousedown", v.mouseDown),
                (i = n.getContext("2d")).translate(r, r),
                i.rotate(v.deg2rad(-90)));
            0 < y && (v.addEventHandler(document, "click", v.handleClick),
            v.config.autoPlay && v.handleClick({
                target: v.links[0],
                preventDefault: function() {}
            })),
            _._writeDebug("threeSixtyPlayer.init(): Found " + y + " relevant items."),
            v.config.useFavIcon && void 0 !== this.VUMeter && (this.vuMeter = new this.VUMeter(this))
        }
    }
    t.prototype.VUMeter = function(t) {
        var a = t
          , o = this
          , n = document.getElementsByTagName("head")[0]
          , e = navigator.userAgent.match(/opera/i)
          , i = navigator.userAgent.match(/firefox/i);
        this.vuMeterData = [],
        this.vuDataCanvas = null,
        this.setPageIcon = function(t) {
            if (a.config.useFavIcon && a.config.usePeakData && t) {
                var e = document.getElementById("sm2-favicon");
                e && (n.removeChild(e),
                e = null),
                e || ((e = document.createElement("link")).id = "sm2-favicon",
                e.rel = "shortcut icon",
                e.type = "image/png",
                e.href = t,
                document.getElementsByTagName("head")[0].appendChild(e))
            }
        }
        ,
        this.resetPageIcon = function() {
            if (a.config.useFavIcon) {
                var t = document.getElementById("favicon");
                t && (t.href = "/favicon.ico")
            }
        }
        ,
        this.updateVU = function(t) {
            9 <= soundManager.flashVersion && a.config.useFavIcon && a.config.usePeakData && o.setPageIcon(o.vuMeterData[parseInt(16 * t.peakData.left, 10)][parseInt(16 * t.peakData.right, 10)])
        }
        ,
        this.createVUData = function() {
            var t = 0
              , e = 0
              , a = o.vuDataCanvas.getContext("2d")
              , n = a.createLinearGradient(0, 16, 0, 0)
              , i = a.createLinearGradient(0, 16, 0, 0);
            for (n.addColorStop(0, "rgb(0,192,0)"),
            n.addColorStop(.3, "rgb(0,255,0)"),
            n.addColorStop(.625, "rgb(255,255,0)"),
            n.addColorStop(.85, "rgb(255,0,0)"),
            i.addColorStop(0, "rgba(0,0,0,0.2)"),
            i.addColorStop(1, "rgba(0,0,0,0.5)"),
            t = 0; t < 16; t++)
                o.vuMeterData[t] = [];
            for (t = 0; t < 16; t++)
                for (e = 0; e < 16; e++)
                    o.vuDataCanvas.setAttribute("width", 16),
                    o.vuDataCanvas.setAttribute("height", 16),
                    a.fillStyle = i,
                    a.fillRect(0, 0, 7, 15),
                    a.fillRect(8, 0, 7, 15),
                    a.fillStyle = n,
                    a.fillRect(0, 15 - t, 7, 16 - (16 - t)),
                    a.fillRect(8, 15 - e, 7, 16 - (16 - e)),
                    a.clearRect(0, 3, 16, 1),
                    a.clearRect(0, 7, 16, 1),
                    a.clearRect(0, 11, 16, 1),
                    o.vuMeterData[t][e] = o.vuDataCanvas.toDataURL("image/png")
        }
        ,
        this.testCanvas = function() {
            var t = document.createElement("canvas");
            if (!t || void 0 === t.getContext)
                return null;
            if (!t.getContext("2d") || "function" != typeof t.toDataURL)
                return null;
            try {
                t.toDataURL("image/png")
            } catch (t) {
                return null
            }
            return t
        }
        ,
        this.init = function() {
            a.config.useFavIcon && (o.vuDataCanvas = o.testCanvas(),
            o.vuDataCanvas && (i || e) ? o.createVUData() : a.config.useFavIcon = !1)
        }
        ,
        this.init()
    }
    ,
    t.prototype.Metadata = function(r, l) {
        soundManager._wD("Metadata()");
        var u, t, d = this, e = r._360data.oUI360, a = e.getElementsByTagName("ul")[0].getElementsByTagName("li");
        for (this.lastWPExec = 0,
        this.refreshInterval = 250,
        this.totalTime = 0,
        this.events = {
            whileplaying: function() {
                var t, e, a, n = r._360data.width, i = r._360data.radius, o = r.durationEstimate || 1e3 * d.totalTime, s = null;
                for (t = 0,
                e = d.data.length; t < e; t++)
                    s = t % 2 == 0,
                    l.drawSolidArc(r._360data.oCanvas, s ? l.config.segmentRingColorAlt : l.config.segmentRingColor, n, i / 2, l.deg2rad(d.data[u].endTimeMS / o * 360), l.deg2rad((d.data[u].startTimeMS || 1) / o * 360), !0);
                (a = new Date) - d.lastWPExec > d.refreshInterval && (d.refresh(),
                d.lastWPExec = a)
            }
        },
        this.refresh = function() {
            var t, e, a = null, n = r.position, i = r._360data.metadata.data;
            for (t = 0,
            e = i.length; t < e; t++)
                if (n >= i[t].startTimeMS && n <= i[t].endTimeMS) {
                    a = t;
                    break
                }
            a !== i.currentItem && a < i.length && (r._360data.oLink.innerHTML = i.mainTitle + ' <span class="metadata"><span class="sm2_divider"> | </span><span class="sm2_metadata">' + i[a].title + "</span></span>",
            i.currentItem = a)
        }
        ,
        this.strToTime = function(t) {
            var e, a = t.split(":"), n = 0;
            for (e = a.length; e--; )
                n += parseInt(a[e], 10) * Math.pow(60, a.length - 1 - e);
            return n
        }
        ,
        this.data = [],
        this.data.givenDuration = null,
        this.data.currentItem = null,
        this.data.mainTitle = r._360data.oLink.innerHTML,
        u = 0; u < a.length; u++)
            this.data[u] = {
                o: null,
                title: a[u].getElementsByTagName("p")[0].innerHTML,
                startTime: a[u].getElementsByTagName("span")[0].innerHTML,
                startSeconds: d.strToTime(a[u].getElementsByTagName("span")[0].innerHTML.replace(/[()]/g, "")),
                duration: 0,
                durationMS: null,
                startTimeMS: null,
                endTimeMS: null,
                oNote: null
            };
        for (t = l.getElementsByClassName("duration", "div", e),
        this.data.givenDuration = t.length ? 1e3 * d.strToTime(t[0].innerHTML) : 0,
        u = 0; u < this.data.length; u++)
            this.data[u].duration = parseInt(this.data[u + 1] ? this.data[u + 1].startSeconds : (d.data.givenDuration ? d.data.givenDuration : r.durationEstimate) / 1e3, 10) - this.data[u].startSeconds,
            this.data[u].startTimeMS = 1e3 * this.data[u].startSeconds,
            this.data[u].durationMS = 1e3 * this.data[u].duration,
            this.data[u].endTimeMS = this.data[u].startTimeMS + this.data[u].durationMS,
            this.totalTime += this.data[u].duration
    }
    ,
    navigator.userAgent.match(/webkit/i) && navigator.userAgent.match(/mobile/i) && soundManager.setup({
        useHTML5Audio: !0
    }),
    soundManager.setup({
        html5PollingInterval: 50,
        debugMode: T.location.href.match(/debug=1/i),
        consoleOnly: !0,
        flashVersion: 9,
        useHighPerformance: !0
    }),
    soundManager.debugMode && T.setInterval(function() {
        var t = T.threeSixtyPlayer;
        t && t.lastSound && t.lastSound._360data.fps && void 0 === T.isHome && (soundManager._writeDebug("fps: ~" + t.lastSound._360data.fps),
        t.lastSound._360data.fps = 0)
    }, 1e3),
    T.ThreeSixtyPlayer = t,
    T.threeSixtyPlayer = new t
}(window),
soundManager.onready(threeSixtyPlayer.init);
