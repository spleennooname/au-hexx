! function(t) {
    function e(r) {
        if (n[r]) return n[r].exports;
        var i = n[r] = {
            exports: {},
            id: r,
            loaded: !1
        };
        return t[r].call(i.exports, i, i.exports, e), i.loaded = !0, i.exports
    }
    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0)
}([function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i() {
        o = s.createCanvas(), document.body.appendChild(o), a = new l.default(o), f.default.setup(a.gl), f.default.load().then(function() {
            a.play()
        })
    }
    var o, a, s = n(1),
        u = n(2),
        l = r(u),
        c = n(8),
        h = (r(c), n(49)),
        f = r(h);
    window.addEventListener("DOMContentLoaded", i)
}, function(t, e) {
    "use strict";

    function n(t, e) {
        var n = t || window.innerWidth,
            r = e || window.innerHeight,
            i = document.createElement("canvas");
        return i.width = n, i.height = r, i.style.width = n + "px", i.style.height = r + "px", i
    }

    function r() {
        return Math.min(Math.max(1, window.devicePixelRatio), 2)
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.createCanvas = n, e.getPixelRatio = r
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = n(3),
        o = r(i),
        a = n(8),
        s = r(a),
        u = o.default({
            init: function() {
                this.scene = new s.default(this), this.gl.enable(this.gl.DEPTH_TEST), this.gl.frontFace(this.gl.CCW)
            },
            getContextOptions: function() {
                return {
                    depth: !0,
                    stencil: !0,
                    antialias: window.devicePixelRatio <= 1,
                    alpha: !1,
                    premultipliedAlpha: !1,
                    preserveDrawingBuffer: !1
                }
            },
            render: function(t) {
                this.scene.render(t)
            },
            resize: function() {}
        });
    e.default = u
}, function(t, e, n) {
    var r = n(4),
        i = n(7),
        o = function() {};
    t.exports = function(t) {
        var e = void 0 !== t.pixelRatio ? t.pixelRatio : 0,
            n = void 0 !== t.hdpi ? t.hdpi : !0,
            a = function(t) {
                var r = this.getContextOptions();
                this.gl = t.getContext("webgl", r) || t.getContext("experimental-webgl", r) || t.getContext("webgl"), this.canvas = t, this.width = 0, this.height = 0, this.canvasWidth = 0, this.canvasHeight = 0, this.pixelRatio = e, this.hdpi = n, this.frame = this._frame.bind(this), this.previousTime = i(), this._rafId = 0, this._playing = !1, this.init()
            },
            s = a.prototype;
        return s.getContextOptions = t.getContextOptions || function() {
            return void 0
        }, s.render = t.render || o, s.resize = t.resize || o, s.init = t.init || o, s.dispose = function() {
            this.stop()
        }, s.play = function() {
            this._playing || (this._playing = !0, this.frame(), this.previousTime = i(), this._requestFrame())
        }, s.stop = function() {
            r.cancel(this._rafId), this._playing = !1, this._rafId = 0
        }, s.updateSize = function() {
            var t = 1;
            this.pixelRatio > 0 ? t = this.pixelRatio : this.hdpi && (t = window.devicePixelRatio), this.canvas.width = t * this.canvasWidth, this.canvas.height = t * this.canvasHeight, this.width = this.gl.drawingBufferWidth, this.height = this.gl.drawingBufferHeight, this.resize()
        }, s._checkSize = function() {
            var t = getComputedStyle(this.canvas),
                e = parseInt(t.getPropertyValue("width")),
                n = parseInt(t.getPropertyValue("height"));
            return isNaN(e) || isNaN(n) || 0 === e || 0 === n ? !1 : ((e !== this.canvasWidth || n !== this.canvasHeight) && (this.canvasWidth = e, this.canvasHeight = n, this.updateSize()), !0)
        }, s._requestFrame = function() {
            r.cancel(this._rafId), this._rafId = r(this.frame)
        }, s._frame = function() {
            if (this._playing) {
                var t = i(),
                    e = (t - this.previousTime) / 1e3;
                this.previousTime = t, (e > .2 || 1 / 180 > e) && (e = 1 / 60), this._checkSize() && this.render(e), this._playing && this._requestFrame()
            }
        }, a
    }
}, function(t, e, n) {
    (function(e) {
        for (var r = n(5), i = "undefined" == typeof window ? e : window, o = ["moz", "webkit"], a = "AnimationFrame", s = i["request" + a], u = i["cancel" + a] || i["cancelRequest" + a], l = 0; !s && l < o.length; l++) s = i[o[l] + "Request" + a], u = i[o[l] + "Cancel" + a] || i[o[l] + "CancelRequest" + a];
        if (!s || !u) {
            var c = 0,
                h = 0,
                f = [],
                d = 1e3 / 60;
            s = function(t) {
                if (0 === f.length) {
                    var e = r(),
                        n = Math.max(0, d - (e - c));
                    c = n + e, setTimeout(function() {
                        var t = f.slice(0);
                        f.length = 0;
                        for (var e = 0; e < t.length; e++)
                            if (!t[e].cancelled) try {
                                t[e].callback(c)
                            } catch (n) {
                                setTimeout(function() {
                                    throw n
                                }, 0)
                            }
                    }, Math.round(n))
                }
                return f.push({
                    handle: ++h,
                    callback: t,
                    cancelled: !1
                }), h
            }, u = function(t) {
                for (var e = 0; e < f.length; e++) f[e].handle === t && (f[e].cancelled = !0)
            }
        }
        t.exports = function(t) {
            return s.call(i, t)
        }, t.exports.cancel = function() {
            u.apply(i, arguments)
        }, t.exports.polyfill = function() {
            i.requestAnimationFrame = s, i.cancelAnimationFrame = u
        }
    }).call(e, function() {
        return this
    }())
}, function(t, e, n) {
    (function(e) {
        (function() {
            var n, r, i;
            "undefined" != typeof performance && null !== performance && performance.now ? t.exports = function() {
                return performance.now()
            } : void 0 !== e && null !== e && e.hrtime ? (t.exports = function() {
                return (n() - i) / 1e6
            }, r = e.hrtime, n = function() {
                var t;
                return t = r(), 1e9 * t[0] + t[1]
            }, i = n()) : Date.now ? (t.exports = function() {
                return Date.now() - i
            }, i = Date.now()) : (t.exports = function() {
                return (new Date).getTime() - i
            }, i = (new Date).getTime())
        }).call(this)
    }).call(e, n(6))
}, function(t) {
    function e(t) {
        if (s === setTimeout) return setTimeout(t, 0);
        try {
            return s(t, 0)
        } catch (e) {
            try {
                return s.call(null, t, 0)
            } catch (e) {
                return s.call(this, t, 0)
            }
        }
    }

    function n(t) {
        if (u === clearTimeout) return clearTimeout(t);
        try {
            return u(t)
        } catch (e) {
            try {
                return u.call(null, t)
            } catch (e) {
                return u.call(this, t)
            }
        }
    }

    function r() {
        f && c && (f = !1, c.length ? h = c.concat(h) : d = -1, h.length && i())
    }

    function i() {
        if (!f) {
            var t = e(r);
            f = !0;
            for (var i = h.length; i;) {
                for (c = h, h = []; ++d < i;) c && c[d].run();
                d = -1, i = h.length
            }
            c = null, f = !1, n(t)
        }
    }

    function o(t, e) {
        this.fun = t, this.array = e
    }

    function a() {}
    var s, u, l = t.exports = {};
    ! function() {
        try {
            s = setTimeout
        } catch (t) {
            s = function() {
                throw Error("setTimeout is not defined")
            }
        }
        try {
            u = clearTimeout
        } catch (t) {
            u = function() {
                throw Error("clearTimeout is not defined")
            }
        }
    }();
    var c, h = [],
        f = !1,
        d = -1;
    l.nextTick = function(t) {
        var n = Array(arguments.length - 1);
        if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
        h.push(new o(t, n)), 1 !== h.length || f || e(i)
    }, o.prototype.run = function() {
        this.fun.apply(null, this.array)
    }, l.title = "browser", l.browser = !0, l.env = {}, l.argv = [], l.version = "", l.versions = {}, l.on = a, l.addListener = a, l.once = a, l.off = a, l.removeListener = a, l.removeAllListeners = a, l.emit = a, l.binding = function() {
        throw Error("process.binding is not supported")
    }, l.cwd = function() {
        return "/"
    }, l.chdir = function() {
        throw Error("process.chdir is not supported")
    }, l.umask = function() {
        return 0
    }
}, function(t, e) {
    (function(e) {
        t.exports = e.performance && e.performance.now ? function() {
            return performance.now()
        } : Date.now || function() {
            return +new Date
        }
    }).call(e, function() {
        return this
    }())
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o, a, s = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        u = n(9),
        l = r(u),
        c = n(12),
        h = r(c),
        f = n(13),
        d = r(f),
        p = n(21),
        _ = r(p),
        m = n(26),
        v = r(m),
        M = n(37),
        g = (n(27), n(38)),
        b = r(g),
        x = n(44),
        y = r(x),
        w = 0,
        S = {},
        I = function() {
            function t(e) {
                i(this, t), document.body.removeChild(document.querySelector(".dg")), this.renderer = e, this.gl = e.gl, this.dt = 1 / 60, this.root = new d.default, this.camera = null, this.programs = null, this.init(), this.initGrid()
            }
            return s(t, [{
                key: "init",
                value: function() {
                    var t = this.gl;
                    t.state = new l.default(t), this.initPrograms(), this.initCamera(), this.initControls(), this.pyramidGlass = new y.default(this), this.root.add(this.pyramidGlass.root), this.renderer._checkSize()
                }
            }, {
                key: "initGrid",
                value: function() {
                    this.grid = new b.default(this.gl), this.root.add(this.grid), this.grid.rotateX(.5 * Math.PI), this.grid.y = -8
                }
            }, {
                key: "initPrograms",
                value: function() {
                    for (var t = this.gl, e = ["basic2D", "basic3D", "pyramid-glass"], r = 0; r < e.length; r++) {
                        var i = e[r],
                            o = "precision highp float;\n",
                            a = new h.default(t);
                        a.compile(n(70)("./" + i + ".vert"), n(74)("./" + i + ".frag"), o), a.use(), S[i] = a
                    }
                    this.programs = S
                }
            }, {
                key: "initCamera",
                value: function() {
                    o = _.default.makePerspectiveCamera(), o.lens.setAutoFov(M.degreesToRadians(45)), o.lens.near = .1, o.lens.far = 1e3, o.position[1] = 2, this.root.add(o), this.camera = o
                }
            }, {
                key: "initControls",
                value: function() {
                    a = new v.default(this.renderer.canvas), a.start(this.camera), a.radius = 25
                }
            }, {
                key: "render",
                value: function(t) {
                    var e = this.gl;
                    w += t, a.update(), o.updateViewProjectionMatrix(this.renderer.width, this.renderer.height), this.pyramidGlass.preRender(t), this.root.updateWorldMatrix(), e.bindFramebuffer(e.FRAMEBUFFER, null), e.clearColor(.6, .6, .6, 1), e.viewport(0, 0, this.renderer.width, this.renderer.height), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), this.grid.render(this.camera), this.pyramidGlass.render(t)
                }
            }]), t
        }();
    e.default = I
}, function(t, e, n) {
    function r(t) {
        this.gl = t, this.cfgStack = new a, this.cfgStack.initFromGL(t), this._validCfg = !1
    }

    function i(t) {
        o.call(this), this.state = t
    }
    var o = n(10),
        a = n(11),
        s = new o;
    r.prototype = {
        push: function(t) {
            this.cfgStack.push(t), this._validCfg = !1
        },
        pop: function() {
            this.cfgStack.pop(), this._validCfg = !1
        },
        apply: function() {
            this._validCfg || (this.cfgStack.commit(s), s.setupGL(this.gl), this._validCfg = !0)
        },
        now: function(t) {
            this.push(t), this.apply(), this.pop()
        },
        config: function() {
            return new i(this)
        }
    }, i.prototype = Object.create(o.prototype), i.prototype.constructor = i, i.prototype.apply = function() {
        this.state.now(this)
    }, r.config = function() {
        return new o
    }, t.exports = r
}, function(t) {
    ! function() {
        function e(t) {
            return t | (4096 & t) >>> 2 | (2048 & t) >>> 2 | (524288 & t) >>> 3 | (1048576 & t) >>> 3 | (2097152 & t) >>> 3
        }

        function n(t) {
            return 0 | Math.round(65535 * t)
        }

        function r(t) {
            return t / 65535
        }

        function i(t) {
            var e = (31744 & t) >> 10,
                n = 1023 & t;
            return (t >> 15 ? -1 : 1) * (e ? 31 === e ? n ? 0 / 0 : 1 / 0 : Math.pow(2, e - 15) * (1 + n / 1024) : 6103515625e-14 * (n / 1024))
        }

        function o(t) {
            s[0] = t;
            var e = u[0],
                n = e >> 31 << 5,
                r = e >> 23 & 255;
            return r = r - 112 & 112 - r >> 4 >> 27, n = (n | r) << 10, n |= e >> 13 & 1023
        }

        function a() {
            this._dat = new Uint16Array(51), this._set = 0
        }
        var s = new Float32Array(1),
            u = new Uint32Array(s.buffer),
            l = [1, 512, 1024, 1024, 2048, 4096, 4096, 4, 8192, 2, 16384, 32768, 256, 65536, 65536, 65536, 262144, 131072, 131072, 131072, 524288, 524288, 524288, 2097152, 1048576, 1048576, 1048576, 128, 4194304, 4194304, 4194304, 4194304, 8, 16, 8388608, 8388608, 32, 64, 16777216, 33554432, 67108864, 67108864, 67108864, 67108864, 134217728, 134217728, 134217728, 134217728, 268435456, 268435456, 536870912],
            c = 935847839,
            h = new Uint16Array([0, 32774, 0, 1, 0, 0, 0, 0, 513, 0, 1029, 2305, 0, 519, 0, 65535, 65535, 7680, 7680, 7680, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 15, 1, 0, 0, 0, 0, 0, 0, 0, 0, n(0), n(1), o(1)]),
            f = function(t, e) {
                return t.getParameter(e)
            };
        a.DAT_MASKS = l, a.encodeHalf = function(t) {
            return o(t)
        }, a.decodeHalf = function(t) {
            return i(t)
        }, a.prototype = {
            toDefault: function() {
                this._dat.set(h), this._set = 0 | c
            },
            clone: function() {
                var t = new a;
                return t._dat.set(this._dat), t._set = this._set, t
            },
            patch: function(t, n) {
                for (var r, i = this._dat, o = this._set, a = t._dat, s = t._set, u = n._dat, c = 0, h = 0; 51 > h; h++) r = l[h], 0 !== (o & r) && ((0 === (s & r) || i[h] !== a[h]) && (c |= r), a[h] = i[h]);
                u.set(a), t._set |= o, n._set = e(c)
            },
            setupGL: function(t) {
                var e, n = this._set,
                    o = this._dat;
                if (0 !== (1 & n) && (o[0] ? t.enable(3042) : t.disable(3042)), e = 2560 & n, 0 !== e && (2560 === e ? t.blendEquationSeparate(o[1], o[4]) : t.blendEquation(o[1])), e = 5120 & n, 0 !== e && (5120 === e ? t.blendFuncSeparate(o[3], o[2], o[6], o[5]) : t.blendFunc(o[3], o[2])), 0 !== (4 & n) && (o[7] ? t.enable(2929) : t.disable(2929)), 0 !== (8192 & n) && t.depthFunc(o[8]), 0 !== (2 & n) && (o[9] ? t.enable(2884) : t.disable(2884)), 0 !== (16384 & n) && t.cullFace(o[10]), 0 !== (32768 & n) && t.frontFace(o[11]), 0 !== (536870912 & n) && t.lineWidth(i(o[50])), 0 !== (256 & n) && (o[12] ? t.enable(2960) : t.disable(2960)), e = 589824 & n, 0 !== e && (589824 === e ? (t.stencilFuncSeparate(1028, o[13], o[14], o[15]), t.stencilFuncSeparate(1029, o[20], o[21], o[22])) : t.stencilFunc(o[13], o[14], o[15])), e = 1179648 & n, 0 !== e && (1179648 === e ? (t.stencilOpSeparate(1028, o[17], o[18], o[19]), t.stencilOpSeparate(1029, o[24], o[25], o[26])) : t.stencilOp(o[17], o[18], o[19])), e = 2359296 & n, 0 !== e && (2359296 === e ? (t.stencilMaskSeparate(1028, o[16]), t.stencilMaskSeparate(1029, o[23])) : t.stencilMask(o[16])), 0 !== (16777216 & n)) {
                    var a = o[38];
                    t.colorMask(1 === (1 & a), 2 === (2 & a), 4 === (4 & a), 8 === (8 & a))
                }
                0 !== (33554432 & n) && t.depthMask(1 === o[39]), 0 !== (67108864 & n) && t.blendColor(i(o[40]), i(o[41]), i(o[42]), i(o[43])), 0 !== (128 & n) && (o[27] ? t.enable(3089) : t.disable(3089)), 0 !== (4194304 & n) && t.scissor(o[28], o[29], o[30], o[31]), 0 !== (134217728 & n) && t.viewport(o[44], o[45], o[46], o[47]), 0 !== (16 & n) && (o[33] ? t.enable(32823) : t.disable(32823)), 0 !== (8388608 & n) && t.polygonOffset(i(o[34]), i(o[35])), 0 !== (268435456 & n) && t.depthRange(r(o[48]), r(o[49]))
            },
            fromGL: function(t) {
                this._set = 0;
                var e = f(t, 3042),
                    n = f(t, 2884),
                    r = f(t, 2929),
                    i = f(t, 3024),
                    o = f(t, 32823),
                    a = f(t, 3089),
                    s = f(t, 2960),
                    u = f(t, 32969),
                    l = f(t, 32968),
                    c = f(t, 32971),
                    h = f(t, 32970),
                    d = f(t, 32777),
                    p = f(t, 34877),
                    _ = f(t, 2962),
                    m = f(t, 2967),
                    v = f(t, 2963),
                    M = f(t, 2968),
                    g = f(t, 2964),
                    b = f(t, 2965),
                    x = f(t, 2966),
                    y = f(t, 34816),
                    w = f(t, 36003),
                    S = f(t, 36004),
                    I = f(t, 36005),
                    E = f(t, 34817),
                    D = f(t, 34818),
                    A = f(t, 34819),
                    F = f(t, 32824),
                    P = f(t, 10752),
                    C = f(t, 3088),
                    T = f(t, 3107),
                    R = f(t, 2930),
                    O = f(t, 32773),
                    L = f(t, 2978),
                    z = f(t, 2928),
                    k = f(t, 2849);
                this.enableBlend(e), u !== c || l !== h ? this.blendFuncSeparate(u, l, c, h) : this.blendFunc(u, l), d !== p ? this.blendEquationSeparate(d, p) : this.blendEquation(d), this.enableStencil(s), _ !== y || m !== w || v !== S ? this.stencilFuncSeparate(_, m, v, y, w, S) : this.stencilFunc(_, m, v), g !== E || b !== D || x !== A ? this.stencilOpSeparate(g, b, x, E, D, A) : this.stencilOp(g, b, x), M !== I ? this.stencilMaskSeparate(M, I) : this.stencilMask(M), this.depthFunc(t.getParameter(2932)), this.enableDepthTest(r), this.cullFace(t.getParameter(2885)), this.enableCullface(n), this.frontFace(t.getParameter(2886)), this.enablePolygonOffset(o), this.polygonOffset(F, P), this.enableScissor(a), this.scissor(C[0], C[1], C[2], C[3]), this.enableDither(i), this.colorMask(T[0], T[1], T[2], T[3]), this.depthMask(R), this.blendColor(O[0], O[1], O[2], O[3]), this.viewport(L[0], L[1], L[2], L[3]), this.depthRange(z[0], z[1]), this.lineWidth(k)
            },
            enableBlend: function(t) {
                return void 0 === t && (t = !0), this._dat[0] = 0 | t, this._set |= 1, this
            },
            blendFunc: function(t, e) {
                return this._dat[3] = t, this._dat[2] = e, this._set = -4097 & this._set | 1024, this
            },
            blendFuncSeparate: function(t, e, n, r) {
                return this._dat[3] = t, this._dat[2] = e, this._dat[6] = n, this._dat[5] = r, this._set |= 5120, this
            },
            blendEquation: function(t) {
                return this._dat[1] = t, this._set = -2049 & this._set | 512, this
            },
            blendEquationSeparate: function(t, e) {
                return this._dat[1] = t, this._dat[4] = e, this._set |= 2560, this
            },
            blendColor: function(t, e, n, r) {
                return this._dat[40] = o(t), this._dat[41] = o(e), this._dat[42] = o(n), this._dat[43] = o(r), this._set |= 67108864, this
            },
            depthFunc: function(t) {
                return this._dat[8] = t, this._set |= 8192, this
            },
            enableDepthTest: function(t) {
                return void 0 === t && (t = !0), this._dat[7] = 0 | t, this._set |= 4, this
            },
            depthRange: function(t, e) {
                return this._dat[48] = n(t), this._dat[49] = n(e), this._set |= 268435456, this
            },
            lineWidth: function(t) {
                return this._dat[50] = o(t), this._set |= 536870912, this
            },
            cullFace: function(t) {
                return this._dat[10] = t, this._set |= 16384, this
            },
            enableCullface: function(t) {
                return void 0 === t && (t = !0), this._dat[9] = 0 | t, this._set |= 2, this
            },
            polygonOffset: function(t, e) {
                return this._dat[34] = o(t), this._dat[35] = o(e), this._set |= 8388608, this
            },
            enablePolygonOffset: function(t) {
                return void 0 === t && (t = !0), this._dat[33] = 0 | t, this._set |= 16, this
            },
            enableScissor: function(t) {
                return void 0 === t && (t = !0), this._dat[27] = 0 | t, this._set |= 128, this
            },
            scissor: function(t, e, n, r) {
                return this._dat[28] = t, this._dat[29] = e, this._dat[30] = n, this._dat[31] = r, this._set |= 4194304, this
            },
            viewport: function(t, e, n, r) {
                return this._dat[44] = t, this._dat[45] = e, this._dat[46] = n, this._dat[47] = r, this._set |= 134217728, this
            },
            enableDither: function(t) {
                return void 0 === t && (t = !0), this._dat[32] = 0 | t, this._set |= 8, this
            },
            depthMask: function(t) {
                return this._dat[39] = 0 | t, this._set |= 33554432, this
            },
            colorMask: function(t, e, n, r) {
                var i = 0 | t | (0 | e) << 1 | (0 | n) << 2 | (0 | r) << 3;
                return this._dat[38] = i, this._set |= 16777216, this
            },
            frontFace: function(t) {
                return this._dat[11] = t, this._set |= 32768, this
            },
            enableStencil: function(t) {
                return void 0 === t && (t = !0), this._dat[12] = 0 | t, this._set |= 256, this
            },
            stencilFunc: function(t, e, n) {
                return this._dat[13] = t, this._dat[14] = e, this._dat[15] = n, this._set = -524289 & this._set | 65536, this
            },
            stencilOp: function(t, e, n) {
                return this._dat[17] = t, this._dat[18] = e, this._dat[19] = n, this._set = -1048577 & this._set | 131072, this
            },
            stencilMask: function(t) {
                return this._dat[16] = t, this._set = -2097153 & this._set | 262144, this
            },
            stencilFuncSeparate: function(t, e, n, r, i, o) {
                var a = this._dat;
                return a[13] = t, a[14] = e, a[15] = n, a[20] = r, a[21] = i, a[22] = o, this._set |= 589824, this
            },
            stencilOpSeparate: function(t, e, n, r, i, o) {
                var a = this._dat;
                return a[17] = t, a[18] = e, a[19] = n, a[24] = r, a[25] = i, a[26] = o, this._set |= 1179648, this
            },
            stencilMaskSeparate: function(t, e) {
                return this._dat[16] = t, this._dat[23] = e, this._set |= 2359296, this
            }
        }, t.exports = a
    }()
}, function(t, e, n) {
    ! function() {
        function e() {
            this._stack = new Uint32Array(816), this._sets = new Uint32Array(16), this._tmpDat = new Uint32Array(51), this._size = 16, this._ptr = 0, this._headPos = 0, this._wcfg = new r
        }
        var r = n(10),
            i = r.DAT_MASKS;
        e.prototype = {
            initFromGL: function(t) {
                this._ptr = 0, this._wcfg.fromGL(t), this._sets[0] = 0, this._stack.set(this._wcfg._dat)
            },
            push: function(t) {
                var e, n, r, o, a, s, u, l = this._ptr,
                    c = this._sets[l++],
                    h = t._set;
                for (l == this._size && this._grow(), c |= h, this._sets[l] = c, this._ptr = l, e = 51 * l, n = this._stack, r = t._dat, o = this._tmpDat, a = 0; 51 > a; a++) s = i[a], u = 0 !== (h & s) ? r[a] : n[e + a - 51], o[a] = u;
                n.set(o, e)
            },
            pop: function() {
                var t = --this._ptr;
                this._headPos > t && (this._sets[t] |= this._sets[t + 1], this._headPos = t)
            },
            flush: function() {
                for (; this._ptr > 0;) this.pop()
            },
            commit: function(t) {
                var e = this._ptr;
                this.copyConfig(e, t), this._headPos = e, this._sets[e - 1] |= this._sets[e], this._sets[e] = 0
            },
            patch: function(t, e) {
                this.copyConfig(this._ptr, this._wcfg), this._wcfg.patch(t, e)
            },
            copyConfig: function(t, e) {
                var n = new Uint32Array(this._stack.buffer, 204 * t, 51);
                e._dat.set(n), e._set = this._sets[t]
            },
            _grow: function() {
                var t = this._size << 1,
                    e = new Uint32Array(51 * t),
                    n = new Uint32Array(t);
                e.set(this._stack, 0), n.set(this._sets, 0), this._stack = e, this._sets = n, this._size = t
            }
        }, t.exports = e
    }()
}, function(t) {
    function e(t, e, n, r) {
        this.gl = t, this.program = t.createProgram(), this.vShader = t.createShader(t.VERTEX_SHADER), this.fShader = t.createShader(t.FRAGMENT_SHADER), this.dyns = [], this.ready = !1, t.attachShader(this.program, this.vShader), t.attachShader(this.program, this.fShader), void 0 !== e && void 0 !== n && this.compile(e, n, r)
    }

    function n(t) {
        console.warn(t)
    }

    function r(t, e) {
        return f[(e + 1 + "").length] + (e + 1) + ": " + t
    }

    function i(t) {
        return t.split("\n").map(r).join("\n")
    }

    function o(t, r, o) {
        return t.shaderSource(r, o), t.compileShader(r), e.debug && !t.getShaderParameter(r, t.COMPILE_STATUS) ? (n(t.getShaderInfoLog(r)), n(i(o)), !1) : !0
    }

    function a(t) {
        return t += "", "uniform" + d[t]
    }

    function s(t, e, n, r) {
        switch (t) {
            case n.FLOAT_MAT2:
            case n.FLOAT_MAT3:
            case n.FLOAT_MAT4:
                return l(t, e, n, r);
            case n.SAMPLER_2D:
            case n.SAMPLER_CUBE:
                return c(t, e, n, r);
            default:
                return u(t, e, n, r)
        }
    }

    function u(t, e, n, r) {
        var i = a(t);
        return function() {
            return 1 === arguments.length && void 0 !== arguments[0].length ? n[i + "v"](e, arguments[0]) : arguments.length > 0 && n[i].apply(n, Array.prototype.concat.apply(e, arguments)), e
        }
    }

    function l(t, e, n, r) {
        var i = a(t);
        return function() {
            if (arguments.length > 0 && void 0 !== arguments[0].length) {
                var t = arguments.length > 1 ? !!arguments[1] : !1;
                n[i + "v"](e, t, arguments[0])
            }
            return e
        }
    }

    function c(t, e, n, r) {
        var i = r.texIndex++;
        return function() {
            return 1 === arguments.length && (void 0 !== arguments[0].bind ? (arguments[0].bind(i), n.uniform1i(e, i)) : n.uniform1i(e, arguments[0])), e
        }
    }

    function h(t) {
        return function() {
            return t
        }
    }
    e.debug = !0, e.prototype = {
        use: function() {
            this.ready || this._grabParameters(), this.gl.useProgram(this.program)
        },
        compile: function(t, r, i) {
            this.ready = !1, i = (i || "") + "\n";
            var a = this.gl;
            if (!o(a, this.fShader, i + r) || !o(a, this.vShader, i + t)) return !1;
            if (a.linkProgram(this.program), e.debug && !a.getProgramParameter(this.program, a.LINK_STATUS)) return n(a.getProgramInfoLog(this.program)), !1;
            for (; this.dyns.length > 0;) delete this[this.dyns.pop()];
            return !0
        },
        dispose: function() {
            null !== this.gl && (this.gl.deleteProgram(this.program), this.gl.deleteShader(this.fShader), this.gl.deleteShader(this.vShader), this.gl = null)
        },
        _grabParameters: function() {
            for (var t = this.gl, e = this.program, n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS), r = {
                    texIndex: 0
                }, i = 0; n > i; ++i) {
                var o = t.getActiveUniform(e, i);
                if (null !== o) {
                    var a = o.name,
                        u = a.indexOf("[");
                    0 > u || (a = a.substring(0, u));
                    var l = t.getUniformLocation(e, o.name);
                    this[a] = s(o.type, l, t, r), this.dyns.push(a)
                } else t.getError()
            }
            for (var c = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES), f = 0; c > f; ++f) {
                var d = t.getActiveAttrib(e, f).name,
                    p = t.getAttribLocation(e, d);
                this[d] = h(p), this.dyns.push(d)
            }
            this.ready = !0
        }
    }, e.prototype.bind = e.prototype.use;
    var f = ["", "   ", "  ", " ", ""],
        d = {};
    d[5126] = "1f", d[35664] = "2f", d[35665] = "3f", d[35666] = "4f", d[35670] = d[5124] = d[35678] = d[35680] = "1i", d[35671] = d[35667] = "2i", d[35672] = d[35668] = "3i", d[35673] = d[35669] = "4i", d[35674] = "Matrix2f", d[35675] = "Matrix3f", d[35676] = "Matrix4f", t.exports = e
}, function(t, e, n) {
    function r() {
        this.position = s.create(), this.rotation = u.create(), this.scale = s.fromValues(1, 1, 1), this._matrix = o.create(), this._wmatrix = o.create(), this._wposition = new Float32Array(this._wmatrix.buffer, 48, 3), this._parent = null, this._children = [], this._invalidM = !0, this._invalidW = !0
    }
    var i = n(14),
        o = n(20),
        a = n(15),
        s = n(18),
        u = n(17),
        l = a.create(),
        c = new Float32Array(l.buffer, 0, 3),
        h = new Float32Array(l.buffer, 12, 3),
        f = new Float32Array(l.buffer, 24, 3);
    VUP = s.fromValues(0, 1, 0), r.prototype = {
        rotateX: function(t) {
            u.rotateX(this.rotation, this.rotation, t), this.invalidate()
        },
        rotateY: function(t) {
            u.rotateY(this.rotation, this.rotation, t), this.invalidate()
        },
        rotateZ: function(t) {
            u.rotateZ(this.rotation, this.rotation, t), this.invalidate()
        },
        set x(t) {
            this.position[0] = t, this.invalidate()
        },
        set y(t) {
            this.position[1] = t, this.invalidate()
        },
        set z(t) {
            this.position[2] = t, this.invalidate()
        },
        get x() {
            return this.position[0]
        },
        get y() {
            return this.position[1]
        },
        get z() {
            return this.position[2]
        },
        setScale: function(t) {
            this.scale[0] = this.scale[1] = this.scale[2] = t, this.invalidate()
        },
        lookAt: function(t) {
            s.subtract(f, this.position, t), s.normalize(f, f), s.cross(c, VUP, f), s.normalize(c, c), s.cross(h, f, c), u.fromMat3(this.rotation, l), this.invalidate()
        },
        setMatrix: function(t) {
            o.copy(this._matrix, t), i.decomposeMat4(t, this.position, this.rotation, this.scale), this._invalidM = !1, this._invalidW = !0
        },
        add: function(t) {
            -1 === this._children.indexOf(t) && (null !== t._parent && t._parent.remove(t), this._children.push(t), t._parent = this)
        },
        remove: function(t) {
            var e = this._children.indexOf(t);
            e > -1 && (this._children.splice(e, 1), t._parent = null)
        },
        invalidate: function() {
            this._invalidM = !0, this._invalidW = !0
        },
        updateMatrix: function() {
            this._invalidM && (o.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scale), this._invalidM = !1)
        },
        updateWorldMatrix: function(t) {
            t = !!t, this.updateMatrix();
            var e = this._hasInvalidWorldMatrix(t);
            e && this._computeWorldMatrix(t);
            for (var n = 0; n < this._children.length; n++) {
                var r = this._children[n];
                r._invalidW = r._invalidW || e, r.updateWorldMatrix(!0)
            }
        },
        _computeWorldMatrix: function(t) {
            var e = this._parent;
            null !== e ? (!t && e._hasInvalidWorldMatrix(!1) && (e.updateMatrix(), e._computeWorldMatrix(!1)), o.multiply(this._wmatrix, e._wmatrix, this._matrix)) : o.copy(this._wmatrix, this._matrix), this._invalidW = !1
        },
        _hasInvalidWorldMatrix: function(t) {
            return this._invalidW || !t && null !== this._parent && this._parent._hasInvalidWorldMatrix(!1)
        }
    }, t.exports = r
}, function(t, e, n) {
    function r(t, e, n, r) {
        e[0] = t[12], e[1] = t[13], e[2] = t[14], r[0] = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]), r[1] = Math.sqrt(t[4] * t[4] + t[5] * t[5] + t[6] * t[6]), r[2] = Math.sqrt(t[8] * t[8] + t[9] * t[9] + t[10] * t[10]), a[0] = t[0] / r[0], a[1] = t[1] / r[0], a[2] = t[2] / r[0], a[3] = t[4] / r[1], a[4] = t[5] / r[1], a[5] = t[6] / r[1], a[6] = t[8] / r[2], a[7] = t[9] / r[2], a[8] = t[10] / r[2], o.fromMat3(n, a)
    }
    var i = n(15),
        o = n(17),
        a = i.create();
    t.exports = {
        decomposeMat4: r
    }
}, function(t, e, n) {
    var r = n(16),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(9);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromMat4 = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(9);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.transpose = function(t, e) {
        if (t === e) {
            var n = e[1],
                r = e[2],
                i = e[5];
            t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = r, t[7] = i
        } else t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8];
        return t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = c * a - s * l,
            f = -c * o + s * u,
            d = l * o - a * u,
            p = n * h + r * f + i * d;
        return p ? (p = 1 / p, t[0] = h * p, t[1] = (-c * r + i * l) * p, t[2] = (s * r - i * a) * p, t[3] = f * p, t[4] = (c * n - i * u) * p, t[5] = (-s * n + i * o) * p, t[6] = d * p, t[7] = (-l * n + r * u) * p, t[8] = (a * n - r * o) * p, t) : null
    }, i.adjoint = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8];
        return t[0] = a * c - s * l, t[1] = i * l - r * c, t[2] = r * s - i * a, t[3] = s * u - o * c, t[4] = n * c - i * u, t[5] = i * o - n * s, t[6] = o * l - a * u, t[7] = r * u - n * l, t[8] = n * a - r * o, t
    }, i.determinant = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3],
            o = t[4],
            a = t[5],
            s = t[6],
            u = t[7],
            l = t[8];
        return e * (l * o - a * u) + n * (-l * i + a * s) + r * (u * i - o * s)
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = n[0],
            d = n[1],
            p = n[2],
            _ = n[3],
            m = n[4],
            v = n[5],
            M = n[6],
            g = n[7],
            b = n[8];
        return t[0] = f * r + d * a + p * l, t[1] = f * i + d * s + p * c, t[2] = f * o + d * u + p * h, t[3] = _ * r + m * a + v * l, t[4] = _ * i + m * s + v * c, t[5] = _ * o + m * u + v * h, t[6] = M * r + g * a + b * l, t[7] = M * i + g * s + b * c, t[8] = M * o + g * u + b * h, t
    }, i.mul = i.multiply, i.translate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = n[0],
            d = n[1];
        return t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = s, t[5] = u, t[6] = f * r + d * a + l, t[7] = f * i + d * s + c, t[8] = f * o + d * u + h, t
    }, i.rotate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = Math.sin(n),
            d = Math.cos(n);
        return t[0] = d * r + f * a, t[1] = d * i + f * s, t[2] = d * o + f * u, t[3] = d * a - f * r, t[4] = d * s - f * i, t[5] = d * u - f * o, t[6] = l, t[7] = c, t[8] = h, t
    }, i.scale = function(t, e, n) {
        var r = n[0],
            i = n[1];
        return t[0] = r * e[0], t[1] = r * e[1], t[2] = r * e[2], t[3] = i * e[3], t[4] = i * e[4], t[5] = i * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
    }, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t
    }, i.fromRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = 0, t[3] = -n, t[4] = r, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromMat2d = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t
    }, i.fromQuat = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n + n,
            s = r + r,
            u = i + i,
            l = n * a,
            c = r * a,
            h = r * s,
            f = i * a,
            d = i * s,
            p = i * u,
            _ = o * a,
            m = o * s,
            v = o * u;
        return t[0] = 1 - h - p, t[3] = c - v, t[6] = f + m, t[1] = c + v, t[4] = 1 - l - p, t[7] = d - _, t[2] = f - m, t[5] = d + _, t[8] = 1 - l - h, t
    }, i.normalFromMat4 = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15],
            M = n * s - r * a,
            g = n * u - i * a,
            b = n * l - o * a,
            x = r * u - i * s,
            y = r * l - o * s,
            w = i * l - o * u,
            S = c * _ - h * p,
            I = c * m - f * p,
            E = c * v - d * p,
            D = h * m - f * _,
            A = h * v - d * _,
            F = f * v - d * m,
            P = M * F - g * A + b * D + x * E - y * I + w * S;
        return P ? (P = 1 / P, t[0] = (s * F - u * A + l * D) * P, t[1] = (u * E - a * F - l * I) * P, t[2] = (a * A - s * E + l * S) * P, t[3] = (i * A - r * F - o * D) * P, t[4] = (n * F - i * E + o * I) * P, t[5] = (r * E - n * A - o * S) * P, t[6] = (_ * w - m * y + v * x) * P, t[7] = (m * b - p * w - v * g) * P, t[8] = (p * y - _ * b + v * M) * P, t) : null
    }, i.str = function(t) {
        return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
    }, t.exports = i
}, function(t) {
    var e = {};
    e.EPSILON = 1e-6, e.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, e.RANDOM = Math.random, e.setMatrixArrayType = function(t) {
        GLMAT_ARRAY_TYPE = t
    };
    var n = Math.PI / 180;
    e.toRadian = function(t) {
        return t * n
    }, t.exports = e
}, function(t, e, n) {
    var r = n(16),
        i = n(15),
        o = n(18),
        a = n(19),
        s = {};
    s.create = function() {
        var t = new r.ARRAY_TYPE(4);
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, s.rotationTo = function() {
        var t = o.create(),
            e = o.fromValues(1, 0, 0),
            n = o.fromValues(0, 1, 0);
        return function(r, i, a) {
            var u = o.dot(i, a);
            return -.999999 > u ? (o.cross(t, e, i), o.length(t) < 1e-6 && o.cross(t, n, i), o.normalize(t, t), s.setAxisAngle(r, t, Math.PI), r) : u > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (o.cross(t, i, a), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + u, s.normalize(r, r))
        }
    }(), s.setAxes = function() {
        var t = i.create();
        return function(e, n, r, i) {
            return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = i[0], t[4] = i[1], t[7] = i[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], s.normalize(e, s.fromMat3(e, t))
        }
    }(), s.clone = a.clone, s.fromValues = a.fromValues, s.copy = a.copy, s.set = a.set, s.identity = function(t) {
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, s.setAxisAngle = function(t, e, n) {
        n = .5 * n;
        var r = Math.sin(n);
        return t[0] = r * e[0], t[1] = r * e[1], t[2] = r * e[2], t[3] = Math.cos(n), t
    }, s.add = a.add, s.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = n[0],
            u = n[1],
            l = n[2],
            c = n[3];
        return t[0] = r * c + a * s + i * l - o * u, t[1] = i * c + a * u + o * s - r * l, t[2] = o * c + a * l + r * u - i * s, t[3] = a * c - r * s - i * u - o * l, t
    }, s.mul = s.multiply, s.scale = a.scale, s.rotateX = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u + a * s, t[1] = i * u + o * s, t[2] = o * u - i * s, t[3] = a * u - r * s, t
    }, s.rotateY = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u - o * s, t[1] = i * u + a * s, t[2] = o * u + r * s, t[3] = a * u - i * s, t
    }, s.rotateZ = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u + i * s, t[1] = i * u - r * s, t[2] = o * u + a * s, t[3] = a * u - o * s, t
    }, s.calculateW = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2];
        return t[0] = n, t[1] = r, t[2] = i, t[3] = Math.sqrt(Math.abs(1 - n * n - r * r - i * i)), t
    }, s.dot = a.dot, s.lerp = a.lerp, s.slerp = function(t, e, n, r) {
        var i, o, a, s, u, l = e[0],
            c = e[1],
            h = e[2],
            f = e[3],
            d = n[0],
            p = n[1],
            _ = n[2],
            m = n[3];
        return o = l * d + c * p + h * _ + f * m, 0 > o && (o = -o, d = -d, p = -p, _ = -_, m = -m), 1 - o > 1e-6 ? (i = Math.acos(o), a = Math.sin(i), s = Math.sin((1 - r) * i) / a, u = Math.sin(r * i) / a) : (s = 1 - r, u = r), t[0] = s * l + u * d, t[1] = s * c + u * p, t[2] = s * h + u * _, t[3] = s * f + u * m, t
    }, s.sqlerp = function() {
        var t = s.create(),
            e = s.create();
        return function(n, r, i, o, a, u) {
            return s.slerp(t, r, a, u), s.slerp(e, i, o, u), s.slerp(n, t, e, 2 * u * (1 - u)), n
        }
    }(), s.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n * n + r * r + i * i + o * o,
            s = a ? 1 / a : 0;
        return t[0] = -n * s, t[1] = -r * s, t[2] = -i * s, t[3] = o * s, t
    }, s.conjugate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t
    }, s.length = a.length, s.len = s.length, s.squaredLength = a.squaredLength, s.sqrLen = s.squaredLength, s.normalize = a.normalize, s.fromMat3 = function(t, e) {
        var n, r = e[0] + e[4] + e[8];
        if (r > 0) n = Math.sqrt(r + 1), t[3] = .5 * n, n = .5 / n, t[0] = (e[5] - e[7]) * n, t[1] = (e[6] - e[2]) * n, t[2] = (e[1] - e[3]) * n;
        else {
            var i = 0;
            e[4] > e[0] && (i = 1), e[8] > e[3 * i + i] && (i = 2);
            var o = (i + 1) % 3,
                a = (i + 2) % 3;
            n = Math.sqrt(e[3 * i + i] - e[3 * o + o] - e[3 * a + a] + 1), t[i] = .5 * n, n = .5 / n, t[3] = (e[3 * o + a] - e[3 * a + o]) * n, t[o] = (e[3 * o + i] + e[3 * i + o]) * n, t[a] = (e[3 * a + i] + e[3 * i + a]) * n
        }
        return t
    }, s.str = function(t) {
        return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }, t.exports = s
}, function(t, e, n) {
    var r = n(16),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(3);
        return t[0] = 0, t[1] = 0, t[2] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(3);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e
    }, i.fromValues = function(t, e, n) {
        var i = new r.ARRAY_TYPE(3);
        return i[0] = t, i[1] = e, i[2] = n, i
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t
    }, i.set = function(t, e, n, r) {
        return t[0] = e, t[1] = n, t[2] = r, t
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t
    }, i.sub = i.subtract, i.multiply = function(t, e, n) {
        return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t
    }, i.mul = i.multiply, i.divide = function(t, e, n) {
        return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t
    }, i.div = i.divide, i.min = function(t, e, n) {
        return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t
    }, i.max = function(t, e, n) {
        return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t
    }, i.scale = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t
    }, i.scaleAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t
    }, i.distance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2];
        return Math.sqrt(n * n + r * r + i * i)
    }, i.dist = i.distance, i.squaredDistance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2];
        return n * n + r * r + i * i
    }, i.sqrDist = i.squaredDistance, i.length = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2];
        return Math.sqrt(e * e + n * n + r * r)
    }, i.len = i.length, i.squaredLength = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2];
        return e * e + n * n + r * r
    }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t
    }, i.inverse = function(t, e) {
        return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t
    }, i.normalize = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = n * n + r * r + i * i;
        return o > 0 && (o = 1 / Math.sqrt(o), t[0] = e[0] * o, t[1] = e[1] * o, t[2] = e[2] * o), t
    }, i.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
    }, i.cross = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2];
        return t[0] = i * u - o * s, t[1] = o * a - r * u, t[2] = r * s - i * a, t
    }, i.lerp = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2];
        return t[0] = i + r * (n[0] - i), t[1] = o + r * (n[1] - o), t[2] = a + r * (n[2] - a), t
    }, i.hermite = function(t, e, n, r, i, o) {
        var a = o * o,
            s = a * (2 * o - 3) + 1,
            u = a * (o - 2) + o,
            l = a * (o - 1),
            c = a * (3 - 2 * o);
        return t[0] = e[0] * s + n[0] * u + r[0] * l + i[0] * c, t[1] = e[1] * s + n[1] * u + r[1] * l + i[1] * c, t[2] = e[2] * s + n[2] * u + r[2] * l + i[2] * c, t
    }, i.bezier = function(t, e, n, r, i, o) {
        var a = 1 - o,
            s = a * a,
            u = o * o,
            l = s * a,
            c = 3 * o * s,
            h = 3 * u * a,
            f = u * o;
        return t[0] = e[0] * l + n[0] * c + r[0] * h + i[0] * f, t[1] = e[1] * l + n[1] * c + r[1] * h + i[1] * f, t[2] = e[2] * l + n[2] * c + r[2] * h + i[2] * f, t
    }, i.random = function(t, e) {
        e = e || 1;
        var n = 2 * r.RANDOM() * Math.PI,
            i = 2 * r.RANDOM() - 1,
            o = Math.sqrt(1 - i * i) * e;
        return t[0] = Math.cos(n) * o, t[1] = Math.sin(n) * o, t[2] = i * e, t
    }, i.transformMat4 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[3] * r + n[7] * i + n[11] * o + n[15];
        return a = a || 1, t[0] = (n[0] * r + n[4] * i + n[8] * o + n[12]) / a, t[1] = (n[1] * r + n[5] * i + n[9] * o + n[13]) / a, t[2] = (n[2] * r + n[6] * i + n[10] * o + n[14]) / a, t
    }, i.transformMat3 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2];
        return t[0] = r * n[0] + i * n[3] + o * n[6], t[1] = r * n[1] + i * n[4] + o * n[7], t[2] = r * n[2] + i * n[5] + o * n[8], t
    }, i.transformQuat = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2],
            l = n[3],
            c = l * r + s * o - u * i,
            h = l * i + u * r - a * o,
            f = l * o + a * i - s * r,
            d = -a * r - s * i - u * o;
        return t[0] = c * l + d * -a + h * -u - f * -s, t[1] = h * l + d * -s + f * -a - c * -u, t[2] = f * l + d * -u + c * -s - h * -a, t
    }, i.rotateX = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[0], o[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), o[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.rotateY = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), o[1] = i[1], o[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.rotateZ = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), o[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), o[2] = i[2], t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.forEach = function() {
        var t = i.create();
        return function(e, n, r, i, o, a) {
            var s, u;
            for (n || (n = 3), r || (r = 0), u = i ? Math.min(i * n + r, e.length) : e.length, s = r; u > s; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], o(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2];
            return e
        }
    }(), i.angle = function(t, e) {
        var n = i.fromValues(t[0], t[1], t[2]),
            r = i.fromValues(e[0], e[1], e[2]);
        i.normalize(n, n), i.normalize(r, r);
        var o = i.dot(n, r);
        return o > 1 ? 0 : Math.acos(o)
    }, i.str = function(t) {
        return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
    }, t.exports = i
}, function(t, e, n) {
    var r = n(16),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(4);
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(4);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
    }, i.fromValues = function(t, e, n, i) {
        var o = new r.ARRAY_TYPE(4);
        return o[0] = t, o[1] = e, o[2] = n, o[3] = i, o
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
    }, i.set = function(t, e, n, r, i) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
    }, i.sub = i.subtract, i.multiply = function(t, e, n) {
        return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t
    }, i.mul = i.multiply, i.divide = function(t, e, n) {
        return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t
    }, i.div = i.divide, i.min = function(t, e, n) {
        return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t
    }, i.max = function(t, e, n) {
        return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t
    }, i.scale = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
    }, i.scaleAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t
    }, i.distance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2],
            o = e[3] - t[3];
        return Math.sqrt(n * n + r * r + i * i + o * o)
    }, i.dist = i.distance, i.squaredDistance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2],
            o = e[3] - t[3];
        return n * n + r * r + i * i + o * o
    }, i.sqrDist = i.squaredDistance, i.length = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3];
        return Math.sqrt(e * e + n * n + r * r + i * i)
    }, i.len = i.length, i.squaredLength = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3];
        return e * e + n * n + r * r + i * i
    }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t
    }, i.inverse = function(t, e) {
        return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t[3] = 1 / e[3], t
    }, i.normalize = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n * n + r * r + i * i + o * o;
        return a > 0 && (a = 1 / Math.sqrt(a), t[0] = n * a, t[1] = r * a, t[2] = i * a, t[3] = o * a), t
    }, i.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
    }, i.lerp = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2],
            s = e[3];
        return t[0] = i + r * (n[0] - i), t[1] = o + r * (n[1] - o), t[2] = a + r * (n[2] - a), t[3] = s + r * (n[3] - s), t
    }, i.random = function(t, e) {
        return e = e || 1, t[0] = r.RANDOM(), t[1] = r.RANDOM(), t[2] = r.RANDOM(), t[3] = r.RANDOM(), i.normalize(t, t), i.scale(t, t, e), t
    }, i.transformMat4 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3];
        return t[0] = n[0] * r + n[4] * i + n[8] * o + n[12] * a, t[1] = n[1] * r + n[5] * i + n[9] * o + n[13] * a, t[2] = n[2] * r + n[6] * i + n[10] * o + n[14] * a, t[3] = n[3] * r + n[7] * i + n[11] * o + n[15] * a, t
    }, i.transformQuat = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2],
            l = n[3],
            c = l * r + s * o - u * i,
            h = l * i + u * r - a * o,
            f = l * o + a * i - s * r,
            d = -a * r - s * i - u * o;
        return t[0] = c * l + d * -a + h * -u - f * -s, t[1] = h * l + d * -s + f * -a - c * -u, t[2] = f * l + d * -u + c * -s - h * -a, t[3] = e[3], t
    }, i.forEach = function() {
        var t = i.create();
        return function(e, n, r, i, o, a) {
            var s, u;
            for (n || (n = 4), r || (r = 0), u = i ? Math.min(i * n + r, e.length) : e.length, s = r; u > s; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], t[3] = e[s + 3], o(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2], e[s + 3] = t[3];
            return e
        }
    }(), i.str = function(t) {
        return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }, t.exports = i
}, function(t, e, n) {
    var r = n(16),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(16);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(16);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.transpose = function(t, e) {
        if (t === e) {
            var n = e[1],
                r = e[2],
                i = e[3],
                o = e[6],
                a = e[7],
                s = e[11];
            t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = r, t[9] = o, t[11] = e[14], t[12] = i, t[13] = a, t[14] = s
        } else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
        return t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15],
            M = n * s - r * a,
            g = n * u - i * a,
            b = n * l - o * a,
            x = r * u - i * s,
            y = r * l - o * s,
            w = i * l - o * u,
            S = c * _ - h * p,
            I = c * m - f * p,
            E = c * v - d * p,
            D = h * m - f * _,
            A = h * v - d * _,
            F = f * v - d * m,
            P = M * F - g * A + b * D + x * E - y * I + w * S;
        return P ? (P = 1 / P, t[0] = (s * F - u * A + l * D) * P, t[1] = (i * A - r * F - o * D) * P, t[2] = (_ * w - m * y + v * x) * P, t[3] = (f * y - h * w - d * x) * P, t[4] = (u * E - a * F - l * I) * P, t[5] = (n * F - i * E + o * I) * P, t[6] = (m * b - p * w - v * g) * P, t[7] = (c * w - f * b + d * g) * P, t[8] = (a * A - s * E + l * S) * P, t[9] = (r * E - n * A - o * S) * P, t[10] = (p * y - _ * b + v * M) * P, t[11] = (h * b - c * y - d * M) * P, t[12] = (s * I - a * D - u * S) * P, t[13] = (n * D - r * I + i * S) * P, t[14] = (_ * g - p * x - m * M) * P, t[15] = (c * x - h * g + f * M) * P, t) : null
    }, i.adjoint = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15];
        return t[0] = s * (f * v - d * m) - h * (u * v - l * m) + _ * (u * d - l * f), t[1] = -(r * (f * v - d * m) - h * (i * v - o * m) + _ * (i * d - o * f)), t[2] = r * (u * v - l * m) - s * (i * v - o * m) + _ * (i * l - o * u), t[3] = -(r * (u * d - l * f) - s * (i * d - o * f) + h * (i * l - o * u)), t[4] = -(a * (f * v - d * m) - c * (u * v - l * m) + p * (u * d - l * f)), t[5] = n * (f * v - d * m) - c * (i * v - o * m) + p * (i * d - o * f), t[6] = -(n * (u * v - l * m) - a * (i * v - o * m) + p * (i * l - o * u)), t[7] = n * (u * d - l * f) - a * (i * d - o * f) + c * (i * l - o * u), t[8] = a * (h * v - d * _) - c * (s * v - l * _) + p * (s * d - l * h), t[9] = -(n * (h * v - d * _) - c * (r * v - o * _) + p * (r * d - o * h)), t[10] = n * (s * v - l * _) - a * (r * v - o * _) + p * (r * l - o * s), t[11] = -(n * (s * d - l * h) - a * (r * d - o * h) + c * (r * l - o * s)), t[12] = -(a * (h * m - f * _) - c * (s * m - u * _) + p * (s * f - u * h)), t[13] = n * (h * m - f * _) - c * (r * m - i * _) + p * (r * f - i * h), t[14] = -(n * (s * m - u * _) - a * (r * m - i * _) + p * (r * u - i * s)), t[15] = n * (s * f - u * h) - a * (r * f - i * h) + c * (r * u - i * s), t
    }, i.determinant = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3],
            o = t[4],
            a = t[5],
            s = t[6],
            u = t[7],
            l = t[8],
            c = t[9],
            h = t[10],
            f = t[11],
            d = t[12],
            p = t[13],
            _ = t[14],
            m = t[15],
            v = e * a - n * o,
            M = e * s - r * o,
            g = e * u - i * o,
            b = n * s - r * a,
            x = n * u - i * a,
            y = r * u - i * s,
            w = l * p - c * d,
            S = l * _ - h * d,
            I = l * m - f * d,
            E = c * _ - h * p,
            D = c * m - f * p,
            A = h * m - f * _;
        return v * A - M * D + g * E + b * I - x * S + y * w
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = e[9],
            d = e[10],
            p = e[11],
            _ = e[12],
            m = e[13],
            v = e[14],
            M = e[15],
            g = n[0],
            b = n[1],
            x = n[2],
            y = n[3];
        return t[0] = g * r + b * s + x * h + y * _, t[1] = g * i + b * u + x * f + y * m, t[2] = g * o + b * l + x * d + y * v, t[3] = g * a + b * c + x * p + y * M, g = n[4], b = n[5], x = n[6], y = n[7], t[4] = g * r + b * s + x * h + y * _, t[5] = g * i + b * u + x * f + y * m, t[6] = g * o + b * l + x * d + y * v, t[7] = g * a + b * c + x * p + y * M, g = n[8], b = n[9], x = n[10], y = n[11], t[8] = g * r + b * s + x * h + y * _, t[9] = g * i + b * u + x * f + y * m, t[10] = g * o + b * l + x * d + y * v, t[11] = g * a + b * c + x * p + y * M, g = n[12], b = n[13], x = n[14], y = n[15], t[12] = g * r + b * s + x * h + y * _, t[13] = g * i + b * u + x * f + y * m, t[14] = g * o + b * l + x * d + y * v, t[15] = g * a + b * c + x * p + y * M, t
    }, i.mul = i.multiply, i.translate = function(t, e, n) {
        var r, i, o, a, s, u, l, c, h, f, d, p, _ = n[0],
            m = n[1],
            v = n[2];
        return e === t ? (t[12] = e[0] * _ + e[4] * m + e[8] * v + e[12], t[13] = e[1] * _ + e[5] * m + e[9] * v + e[13], t[14] = e[2] * _ + e[6] * m + e[10] * v + e[14], t[15] = e[3] * _ + e[7] * m + e[11] * v + e[15]) : (r = e[0], i = e[1], o = e[2], a = e[3], s = e[4], u = e[5], l = e[6], c = e[7], h = e[8], f = e[9], d = e[10], p = e[11], t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = s, t[5] = u, t[6] = l, t[7] = c, t[8] = h, t[9] = f, t[10] = d, t[11] = p, t[12] = r * _ + s * m + h * v + e[12], t[13] = i * _ + u * m + f * v + e[13], t[14] = o * _ + l * m + d * v + e[14], t[15] = a * _ + c * m + p * v + e[15]), t
    }, i.scale = function(t, e, n) {
        var r = n[0],
            i = n[1],
            o = n[2];
        return t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r, t[3] = e[3] * r, t[4] = e[4] * i, t[5] = e[5] * i, t[6] = e[6] * i, t[7] = e[7] * i, t[8] = e[8] * o, t[9] = e[9] * o, t[10] = e[10] * o, t[11] = e[11] * o, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.rotate = function(t, e, n, i) {
        var o, a, s, u, l, c, h, f, d, p, _, m, v, M, g, b, x, y, w, S, I, E, D, A, F = i[0],
            P = i[1],
            C = i[2],
            T = Math.sqrt(F * F + P * P + C * C);
        return Math.abs(T) < r.EPSILON ? null : (T = 1 / T, F *= T, P *= T, C *= T, o = Math.sin(n), a = Math.cos(n), s = 1 - a, u = e[0], l = e[1], c = e[2], h = e[3], f = e[4], d = e[5], p = e[6], _ = e[7], m = e[8], v = e[9], M = e[10], g = e[11], b = F * F * s + a, x = P * F * s + C * o, y = C * F * s - P * o, w = F * P * s - C * o, S = P * P * s + a, I = C * P * s + F * o, E = F * C * s + P * o, D = P * C * s - F * o, A = C * C * s + a, t[0] = u * b + f * x + m * y, t[1] = l * b + d * x + v * y, t[2] = c * b + p * x + M * y, t[3] = h * b + _ * x + g * y, t[4] = u * w + f * S + m * I, t[5] = l * w + d * S + v * I, t[6] = c * w + p * S + M * I, t[7] = h * w + _ * S + g * I, t[8] = u * E + f * D + m * A, t[9] = l * E + d * D + v * A, t[10] = c * E + p * D + M * A, t[11] = h * E + _ * D + g * A, e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t)
    }, i.rotateX = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[4],
            a = e[5],
            s = e[6],
            u = e[7],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = o * i + l * r, t[5] = a * i + c * r, t[6] = s * i + h * r, t[7] = u * i + f * r, t[8] = l * i - o * r, t[9] = c * i - a * r, t[10] = h * i - s * r, t[11] = f * i - u * r, t
    }, i.rotateY = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i - l * r, t[1] = a * i - c * r, t[2] = s * i - h * r, t[3] = u * i - f * r, t[8] = o * r + l * i, t[9] = a * r + c * i, t[10] = s * r + h * i, t[11] = u * r + f * i, t
    }, i.rotateZ = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[4],
            c = e[5],
            h = e[6],
            f = e[7];
        return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i + l * r, t[1] = a * i + c * r, t[2] = s * i + h * r, t[3] = u * i + f * r, t[4] = l * i - o * r, t[5] = c * i - a * r, t[6] = h * i - s * r, t[7] = f * i - u * r, t
    }, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotation = function(t, e, n) {
        var i, o, a, s = n[0],
            u = n[1],
            l = n[2],
            c = Math.sqrt(s * s + u * u + l * l);
        return Math.abs(c) < r.EPSILON ? null : (c = 1 / c, s *= c, u *= c, l *= c, i = Math.sin(e), o = Math.cos(e), a = 1 - o, t[0] = s * s * a + o, t[1] = u * s * a + l * i, t[2] = l * s * a - u * i, t[3] = 0, t[4] = s * u * a - l * i, t[5] = u * u * a + o, t[6] = l * u * a + s * i, t[7] = 0, t[8] = s * l * a + u * i, t[9] = u * l * a - s * i, t[10] = l * l * a + o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
    }, i.fromXRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromYRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromZRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotationTranslation = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = r + r,
            u = i + i,
            l = o + o,
            c = r * s,
            h = r * u,
            f = r * l,
            d = i * u,
            p = i * l,
            _ = o * l,
            m = a * s,
            v = a * u,
            M = a * l;
        return t[0] = 1 - (d + _), t[1] = h + M, t[2] = f - v, t[3] = 0, t[4] = h - M, t[5] = 1 - (c + _), t[6] = p + m, t[7] = 0, t[8] = f + v, t[9] = p - m, t[10] = 1 - (c + d), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.fromRotationTranslationScale = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2],
            s = e[3],
            u = i + i,
            l = o + o,
            c = a + a,
            h = i * u,
            f = i * l,
            d = i * c,
            p = o * l,
            _ = o * c,
            m = a * c,
            v = s * u,
            M = s * l,
            g = s * c,
            b = r[0],
            x = r[1],
            y = r[2];
        return t[0] = (1 - (p + m)) * b, t[1] = (f + g) * b, t[2] = (d - M) * b, t[3] = 0, t[4] = (f - g) * x, t[5] = (1 - (h + m)) * x, t[6] = (_ + v) * x, t[7] = 0, t[8] = (d + M) * y, t[9] = (_ - v) * y, t[10] = (1 - (h + p)) * y, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.fromRotationTranslationScaleOrigin = function(t, e, n, r, i) {
        var o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = o + o,
            c = a + a,
            h = s + s,
            f = o * l,
            d = o * c,
            p = o * h,
            _ = a * c,
            m = a * h,
            v = s * h,
            M = u * l,
            g = u * c,
            b = u * h,
            x = r[0],
            y = r[1],
            w = r[2],
            S = i[0],
            I = i[1],
            E = i[2];
        return t[0] = (1 - (_ + v)) * x, t[1] = (d + b) * x, t[2] = (p - g) * x, t[3] = 0, t[4] = (d - b) * y, t[5] = (1 - (f + v)) * y, t[6] = (m + M) * y, t[7] = 0, t[8] = (p + g) * w, t[9] = (m - M) * w, t[10] = (1 - (f + _)) * w, t[11] = 0, t[12] = n[0] + S - (t[0] * S + t[4] * I + t[8] * E), t[13] = n[1] + I - (t[1] * S + t[5] * I + t[9] * E), t[14] = n[2] + E - (t[2] * S + t[6] * I + t[10] * E), t[15] = 1, t
    }, i.fromQuat = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n + n,
            s = r + r,
            u = i + i,
            l = n * a,
            c = r * a,
            h = r * s,
            f = i * a,
            d = i * s,
            p = i * u,
            _ = o * a,
            m = o * s,
            v = o * u;
        return t[0] = 1 - h - p, t[1] = c + v, t[2] = f - m, t[3] = 0, t[4] = c - v, t[5] = 1 - l - p, t[6] = d + _, t[7] = 0, t[8] = f + m, t[9] = d - _, t[10] = 1 - l - h, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.frustum = function(t, e, n, r, i, o, a) {
        var s = 1 / (n - e),
            u = 1 / (i - r),
            l = 1 / (o - a);
        return t[0] = 2 * o * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * o * u, t[6] = 0, t[7] = 0, t[8] = (n + e) * s, t[9] = (i + r) * u, t[10] = (a + o) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = a * o * 2 * l, t[15] = 0, t
    }, i.perspective = function(t, e, n, r, i) {
        var o = 1 / Math.tan(e / 2),
            a = 1 / (r - i);
        return t[0] = o / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (i + r) * a, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * i * r * a, t[15] = 0, t
    }, i.perspectiveFromFieldOfView = function(t, e, n, r) {
        var i = Math.tan(e.upDegrees * Math.PI / 180),
            o = Math.tan(e.downDegrees * Math.PI / 180),
            a = Math.tan(e.leftDegrees * Math.PI / 180),
            s = Math.tan(e.rightDegrees * Math.PI / 180),
            u = 2 / (a + s),
            l = 2 / (i + o);
        return t[0] = u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = -((a - s) * u * .5), t[9] = (i - o) * l * .5, t[10] = r / (n - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * n / (n - r), t[15] = 0, t
    }, i.ortho = function(t, e, n, r, i, o, a) {
        var s = 1 / (e - n),
            u = 1 / (r - i),
            l = 1 / (o - a);
        return t[0] = -2 * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * l, t[11] = 0, t[12] = (e + n) * s, t[13] = (i + r) * u, t[14] = (a + o) * l, t[15] = 1, t
    }, i.lookAt = function(t, e, n, o) {
        var a, s, u, l, c, h, f, d, p, _, m = e[0],
            v = e[1],
            M = e[2],
            g = o[0],
            b = o[1],
            x = o[2],
            y = n[0],
            w = n[1],
            S = n[2];
        return Math.abs(m - y) < r.EPSILON && Math.abs(v - w) < r.EPSILON && Math.abs(M - S) < r.EPSILON ? i.identity(t) : (f = m - y, d = v - w, p = M - S, _ = 1 / Math.sqrt(f * f + d * d + p * p), f *= _, d *= _, p *= _, a = b * p - x * d, s = x * f - g * p, u = g * d - b * f, _ = Math.sqrt(a * a + s * s + u * u), _ ? (_ = 1 / _, a *= _, s *= _, u *= _) : (a = 0, s = 0, u = 0), l = d * u - p * s, c = p * a - f * u, h = f * s - d * a, _ = Math.sqrt(l * l + c * c + h * h), _ ? (_ = 1 / _, l *= _, c *= _, h *= _) : (l = 0, c = 0, h = 0), t[0] = a, t[1] = l, t[2] = f, t[3] = 0, t[4] = s, t[5] = c, t[6] = d, t[7] = 0, t[8] = u, t[9] = h, t[10] = p, t[11] = 0, t[12] = -(a * m + s * v + u * M), t[13] = -(l * m + c * v + h * M), t[14] = -(f * m + d * v + p * M), t[15] = 1, t)
    }, i.str = function(t) {
        return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
    }, t.exports = i
}, function(t, e, n) {
    function r(t) {
        i.call(this), this.lens = t, this._view = o.create(), this._viewProj = o.create()
    }
    var i = n(13),
        o = n(22),
        a = n(24),
        s = n(25),
        u = o.create(),
        l = Object.create(i.prototype);
    l.modelViewMatrix = function(t, e) {
        o.multiply(t, e, this._view)
    }, l.modelViewProjectionMatrix = function(t, e) {
        o.multiply(t, this._viewProj, e)
    }, l.unproject = function(t, e) {
        o.invert(u, this._proj), vec3.transformMat4(t, e, u)
    }, l.updateViewProjectionMatrix = function(t, e) {
        this.lens.aspect = t / e, o.multiply(this._viewProj, this.lens.getProjection(), this._view)
    }, l._computeWorldMatrix = function(t) {
        i.prototype._computeWorldMatrix.call(this, t), o.invert(this._view, this._wmatrix)
    }, r.makePerspectiveCamera = function() {
        return new r(new a)
    }, r.makeOrthoCamera = function() {
        return new r(new s)
    }, l.constructor = r, r.prototype = l, t.exports = r
}, function(t, e, n) {
    var r = n(23),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(16);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(16);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.transpose = function(t, e) {
        if (t === e) {
            var n = e[1],
                r = e[2],
                i = e[3],
                o = e[6],
                a = e[7],
                s = e[11];
            t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = r, t[9] = o, t[11] = e[14], t[12] = i, t[13] = a, t[14] = s
        } else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
        return t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15],
            M = n * s - r * a,
            g = n * u - i * a,
            b = n * l - o * a,
            x = r * u - i * s,
            y = r * l - o * s,
            w = i * l - o * u,
            S = c * _ - h * p,
            I = c * m - f * p,
            E = c * v - d * p,
            D = h * m - f * _,
            A = h * v - d * _,
            F = f * v - d * m,
            P = M * F - g * A + b * D + x * E - y * I + w * S;
        return P ? (P = 1 / P, t[0] = (s * F - u * A + l * D) * P, t[1] = (i * A - r * F - o * D) * P, t[2] = (_ * w - m * y + v * x) * P, t[3] = (f * y - h * w - d * x) * P, t[4] = (u * E - a * F - l * I) * P, t[5] = (n * F - i * E + o * I) * P, t[6] = (m * b - p * w - v * g) * P, t[7] = (c * w - f * b + d * g) * P, t[8] = (a * A - s * E + l * S) * P, t[9] = (r * E - n * A - o * S) * P, t[10] = (p * y - _ * b + v * M) * P, t[11] = (h * b - c * y - d * M) * P, t[12] = (s * I - a * D - u * S) * P, t[13] = (n * D - r * I + i * S) * P, t[14] = (_ * g - p * x - m * M) * P, t[15] = (c * x - h * g + f * M) * P, t) : null
    }, i.adjoint = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15];
        return t[0] = s * (f * v - d * m) - h * (u * v - l * m) + _ * (u * d - l * f), t[1] = -(r * (f * v - d * m) - h * (i * v - o * m) + _ * (i * d - o * f)), t[2] = r * (u * v - l * m) - s * (i * v - o * m) + _ * (i * l - o * u), t[3] = -(r * (u * d - l * f) - s * (i * d - o * f) + h * (i * l - o * u)), t[4] = -(a * (f * v - d * m) - c * (u * v - l * m) + p * (u * d - l * f)), t[5] = n * (f * v - d * m) - c * (i * v - o * m) + p * (i * d - o * f), t[6] = -(n * (u * v - l * m) - a * (i * v - o * m) + p * (i * l - o * u)), t[7] = n * (u * d - l * f) - a * (i * d - o * f) + c * (i * l - o * u), t[8] = a * (h * v - d * _) - c * (s * v - l * _) + p * (s * d - l * h), t[9] = -(n * (h * v - d * _) - c * (r * v - o * _) + p * (r * d - o * h)), t[10] = n * (s * v - l * _) - a * (r * v - o * _) + p * (r * l - o * s), t[11] = -(n * (s * d - l * h) - a * (r * d - o * h) + c * (r * l - o * s)), t[12] = -(a * (h * m - f * _) - c * (s * m - u * _) + p * (s * f - u * h)), t[13] = n * (h * m - f * _) - c * (r * m - i * _) + p * (r * f - i * h), t[14] = -(n * (s * m - u * _) - a * (r * m - i * _) + p * (r * u - i * s)), t[15] = n * (s * f - u * h) - a * (r * f - i * h) + c * (r * u - i * s), t
    }, i.determinant = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3],
            o = t[4],
            a = t[5],
            s = t[6],
            u = t[7],
            l = t[8],
            c = t[9],
            h = t[10],
            f = t[11],
            d = t[12],
            p = t[13],
            _ = t[14],
            m = t[15],
            v = e * a - n * o,
            M = e * s - r * o,
            g = e * u - i * o,
            b = n * s - r * a,
            x = n * u - i * a,
            y = r * u - i * s,
            w = l * p - c * d,
            S = l * _ - h * d,
            I = l * m - f * d,
            E = c * _ - h * p,
            D = c * m - f * p,
            A = h * m - f * _;
        return v * A - M * D + g * E + b * I - x * S + y * w
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = e[9],
            d = e[10],
            p = e[11],
            _ = e[12],
            m = e[13],
            v = e[14],
            M = e[15],
            g = n[0],
            b = n[1],
            x = n[2],
            y = n[3];
        return t[0] = g * r + b * s + x * h + y * _, t[1] = g * i + b * u + x * f + y * m, t[2] = g * o + b * l + x * d + y * v, t[3] = g * a + b * c + x * p + y * M, g = n[4], b = n[5], x = n[6], y = n[7], t[4] = g * r + b * s + x * h + y * _, t[5] = g * i + b * u + x * f + y * m, t[6] = g * o + b * l + x * d + y * v, t[7] = g * a + b * c + x * p + y * M, g = n[8], b = n[9], x = n[10], y = n[11], t[8] = g * r + b * s + x * h + y * _, t[9] = g * i + b * u + x * f + y * m, t[10] = g * o + b * l + x * d + y * v, t[11] = g * a + b * c + x * p + y * M, g = n[12], b = n[13], x = n[14], y = n[15], t[12] = g * r + b * s + x * h + y * _, t[13] = g * i + b * u + x * f + y * m, t[14] = g * o + b * l + x * d + y * v, t[15] = g * a + b * c + x * p + y * M, t
    }, i.mul = i.multiply, i.translate = function(t, e, n) {
        var r, i, o, a, s, u, l, c, h, f, d, p, _ = n[0],
            m = n[1],
            v = n[2];
        return e === t ? (t[12] = e[0] * _ + e[4] * m + e[8] * v + e[12], t[13] = e[1] * _ + e[5] * m + e[9] * v + e[13], t[14] = e[2] * _ + e[6] * m + e[10] * v + e[14], t[15] = e[3] * _ + e[7] * m + e[11] * v + e[15]) : (r = e[0], i = e[1], o = e[2], a = e[3], s = e[4], u = e[5], l = e[6], c = e[7], h = e[8], f = e[9], d = e[10], p = e[11], t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = s, t[5] = u, t[6] = l, t[7] = c, t[8] = h, t[9] = f, t[10] = d, t[11] = p, t[12] = r * _ + s * m + h * v + e[12], t[13] = i * _ + u * m + f * v + e[13], t[14] = o * _ + l * m + d * v + e[14], t[15] = a * _ + c * m + p * v + e[15]), t
    }, i.scale = function(t, e, n) {
        var r = n[0],
            i = n[1],
            o = n[2];
        return t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r, t[3] = e[3] * r, t[4] = e[4] * i, t[5] = e[5] * i, t[6] = e[6] * i, t[7] = e[7] * i, t[8] = e[8] * o, t[9] = e[9] * o, t[10] = e[10] * o, t[11] = e[11] * o, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.rotate = function(t, e, n, i) {
        var o, a, s, u, l, c, h, f, d, p, _, m, v, M, g, b, x, y, w, S, I, E, D, A, F = i[0],
            P = i[1],
            C = i[2],
            T = Math.sqrt(F * F + P * P + C * C);
        return Math.abs(T) < r.EPSILON ? null : (T = 1 / T, F *= T, P *= T, C *= T, o = Math.sin(n), a = Math.cos(n), s = 1 - a, u = e[0], l = e[1], c = e[2], h = e[3], f = e[4], d = e[5], p = e[6], _ = e[7], m = e[8], v = e[9], M = e[10], g = e[11], b = F * F * s + a, x = P * F * s + C * o, y = C * F * s - P * o, w = F * P * s - C * o, S = P * P * s + a, I = C * P * s + F * o, E = F * C * s + P * o, D = P * C * s - F * o, A = C * C * s + a, t[0] = u * b + f * x + m * y, t[1] = l * b + d * x + v * y, t[2] = c * b + p * x + M * y, t[3] = h * b + _ * x + g * y, t[4] = u * w + f * S + m * I, t[5] = l * w + d * S + v * I, t[6] = c * w + p * S + M * I, t[7] = h * w + _ * S + g * I, t[8] = u * E + f * D + m * A, t[9] = l * E + d * D + v * A, t[10] = c * E + p * D + M * A, t[11] = h * E + _ * D + g * A, e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t)
    }, i.rotateX = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[4],
            a = e[5],
            s = e[6],
            u = e[7],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = o * i + l * r, t[5] = a * i + c * r, t[6] = s * i + h * r, t[7] = u * i + f * r, t[8] = l * i - o * r, t[9] = c * i - a * r, t[10] = h * i - s * r, t[11] = f * i - u * r, t
    }, i.rotateY = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i - l * r, t[1] = a * i - c * r, t[2] = s * i - h * r, t[3] = u * i - f * r, t[8] = o * r + l * i, t[9] = a * r + c * i, t[10] = s * r + h * i, t[11] = u * r + f * i, t
    }, i.rotateZ = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[4],
            c = e[5],
            h = e[6],
            f = e[7];
        return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i + l * r, t[1] = a * i + c * r, t[2] = s * i + h * r, t[3] = u * i + f * r, t[4] = l * i - o * r, t[5] = c * i - a * r, t[6] = h * i - s * r, t[7] = f * i - u * r, t
    }, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotation = function(t, e, n) {
        var i, o, a, s = n[0],
            u = n[1],
            l = n[2],
            c = Math.sqrt(s * s + u * u + l * l);
        return Math.abs(c) < r.EPSILON ? null : (c = 1 / c, s *= c, u *= c, l *= c, i = Math.sin(e), o = Math.cos(e), a = 1 - o, t[0] = s * s * a + o, t[1] = u * s * a + l * i, t[2] = l * s * a - u * i, t[3] = 0, t[4] = s * u * a - l * i, t[5] = u * u * a + o, t[6] = l * u * a + s * i, t[7] = 0, t[8] = s * l * a + u * i, t[9] = u * l * a - s * i, t[10] = l * l * a + o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
    }, i.fromXRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromYRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromZRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotationTranslation = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = r + r,
            u = i + i,
            l = o + o,
            c = r * s,
            h = r * u,
            f = r * l,
            d = i * u,
            p = i * l,
            _ = o * l,
            m = a * s,
            v = a * u,
            M = a * l;
        return t[0] = 1 - (d + _), t[1] = h + M, t[2] = f - v, t[3] = 0, t[4] = h - M, t[5] = 1 - (c + _), t[6] = p + m, t[7] = 0, t[8] = f + v, t[9] = p - m, t[10] = 1 - (c + d), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.fromRotationTranslationScale = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2],
            s = e[3],
            u = i + i,
            l = o + o,
            c = a + a,
            h = i * u,
            f = i * l,
            d = i * c,
            p = o * l,
            _ = o * c,
            m = a * c,
            v = s * u,
            M = s * l,
            g = s * c,
            b = r[0],
            x = r[1],
            y = r[2];
        return t[0] = (1 - (p + m)) * b, t[1] = (f + g) * b, t[2] = (d - M) * b, t[3] = 0, t[4] = (f - g) * x, t[5] = (1 - (h + m)) * x, t[6] = (_ + v) * x, t[7] = 0, t[8] = (d + M) * y, t[9] = (_ - v) * y, t[10] = (1 - (h + p)) * y, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.fromRotationTranslationScaleOrigin = function(t, e, n, r, i) {
        var o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = o + o,
            c = a + a,
            h = s + s,
            f = o * l,
            d = o * c,
            p = o * h,
            _ = a * c,
            m = a * h,
            v = s * h,
            M = u * l,
            g = u * c,
            b = u * h,
            x = r[0],
            y = r[1],
            w = r[2],
            S = i[0],
            I = i[1],
            E = i[2];
        return t[0] = (1 - (_ + v)) * x, t[1] = (d + b) * x, t[2] = (p - g) * x, t[3] = 0, t[4] = (d - b) * y, t[5] = (1 - (f + v)) * y, t[6] = (m + M) * y, t[7] = 0, t[8] = (p + g) * w, t[9] = (m - M) * w, t[10] = (1 - (f + _)) * w, t[11] = 0, t[12] = n[0] + S - (t[0] * S + t[4] * I + t[8] * E), t[13] = n[1] + I - (t[1] * S + t[5] * I + t[9] * E), t[14] = n[2] + E - (t[2] * S + t[6] * I + t[10] * E), t[15] = 1, t
    }, i.fromQuat = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n + n,
            s = r + r,
            u = i + i,
            l = n * a,
            c = r * a,
            h = r * s,
            f = i * a,
            d = i * s,
            p = i * u,
            _ = o * a,
            m = o * s,
            v = o * u;
        return t[0] = 1 - h - p, t[1] = c + v, t[2] = f - m, t[3] = 0, t[4] = c - v, t[5] = 1 - l - p, t[6] = d + _, t[7] = 0, t[8] = f + m, t[9] = d - _, t[10] = 1 - l - h, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.frustum = function(t, e, n, r, i, o, a) {
        var s = 1 / (n - e),
            u = 1 / (i - r),
            l = 1 / (o - a);
        return t[0] = 2 * o * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * o * u, t[6] = 0, t[7] = 0, t[8] = (n + e) * s, t[9] = (i + r) * u, t[10] = (a + o) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = a * o * 2 * l, t[15] = 0, t
    }, i.perspective = function(t, e, n, r, i) {
        var o = 1 / Math.tan(e / 2),
            a = 1 / (r - i);
        return t[0] = o / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (i + r) * a, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * i * r * a, t[15] = 0, t
    }, i.perspectiveFromFieldOfView = function(t, e, n, r) {
        var i = Math.tan(e.upDegrees * Math.PI / 180),
            o = Math.tan(e.downDegrees * Math.PI / 180),
            a = Math.tan(e.leftDegrees * Math.PI / 180),
            s = Math.tan(e.rightDegrees * Math.PI / 180),
            u = 2 / (a + s),
            l = 2 / (i + o);
        return t[0] = u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = -((a - s) * u * .5), t[9] = (i - o) * l * .5, t[10] = r / (n - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * n / (n - r), t[15] = 0, t
    }, i.ortho = function(t, e, n, r, i, o, a) {
        var s = 1 / (e - n),
            u = 1 / (r - i),
            l = 1 / (o - a);
        return t[0] = -2 * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * l, t[11] = 0, t[12] = (e + n) * s, t[13] = (i + r) * u, t[14] = (a + o) * l, t[15] = 1, t
    }, i.lookAt = function(t, e, n, o) {
        var a, s, u, l, c, h, f, d, p, _, m = e[0],
            v = e[1],
            M = e[2],
            g = o[0],
            b = o[1],
            x = o[2],
            y = n[0],
            w = n[1],
            S = n[2];
        return Math.abs(m - y) < r.EPSILON && Math.abs(v - w) < r.EPSILON && Math.abs(M - S) < r.EPSILON ? i.identity(t) : (f = m - y, d = v - w, p = M - S, _ = 1 / Math.sqrt(f * f + d * d + p * p), f *= _, d *= _, p *= _, a = b * p - x * d, s = x * f - g * p, u = g * d - b * f, _ = Math.sqrt(a * a + s * s + u * u), _ ? (_ = 1 / _, a *= _, s *= _, u *= _) : (a = 0, s = 0, u = 0), l = d * u - p * s, c = p * a - f * u, h = f * s - d * a, _ = Math.sqrt(l * l + c * c + h * h), _ ? (_ = 1 / _, l *= _, c *= _, h *= _) : (l = 0, c = 0, h = 0), t[0] = a, t[1] = l, t[2] = f, t[3] = 0, t[4] = s, t[5] = c, t[6] = d, t[7] = 0, t[8] = u, t[9] = h, t[10] = p, t[11] = 0, t[12] = -(a * m + s * v + u * M), t[13] = -(l * m + c * v + h * M), t[14] = -(f * m + d * v + p * M), t[15] = 1, t)
    }, i.str = function(t) {
        return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
    }, t.exports = i
}, function(t) {
    var e = {};
    e.EPSILON = 1e-6, e.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, e.RANDOM = Math.random, e.setMatrixArrayType = function(t) {
        GLMAT_ARRAY_TYPE = t
    };
    var n = Math.PI / 180;
    e.toRadian = function(t) {
        return t * n
    }, t.exports = e
}, function(t, e, n) {
    function r() {
        this._near = .01, this._far = 10, this._fov = Math.PI / 3, this._vfov = 0, this._hfov = 0, this._aspect = 1, this._fovMode = 0, this._proj = i.create(), this._valid = !1
    }
    var i = n(22),
        o = 1,
        a = 2,
        s = 3;
    r.prototype = {
        getProjection: function() {
            return this._valid || this._updateProjection(), this._proj
        },
        set fov(t) {
            this.setVerticalFov(t)
        },
        get fov() {
            return this._fov
        },
        set near(t) {
            this._near !== t && (this._near = t, this._invalidate())
        },
        get near() {
            return this._near
        },
        set far(t) {
            this._far !== t && (this._far = t, this._invalidate())
        },
        get far() {
            return this._far
        },
        set aspect(t) {
            this._aspect !== t && (this._aspect = t, this._invalidate())
        },
        get aspect() {
            return this._aspect
        },
        setHorizontalFov: function(t) {
            this._fov = t, this._fovMode = a, this._invalidate()
        },
        setVerticalFov: function(t) {
            this._fov = t, this._fovMode = o, this._invalidate()
        },
        getHorizontalFov: function() {
            return this.getProjection(), this._hfov
        },
        getVerticalFov: function() {
            return this.getProjection(), this._vfov
        },
        setAutoFov: function(t) {
            this._fov = t, this._fovMode = s, this._invalidate()
        },
        _updateProjection: function() {
            var t = this._fovMode,
                e = this._aspect;
            t === o || t === s && e > 1 ? (this._vfov = this._fov, this._hfov = 2 * Math.atan(Math.tan(this._fov / 2) * e)) : (this._hfov = this._fov, this._vfov = 2 * Math.atan(Math.tan(this._fov / 2) / e)), i.perspective(this._proj, this._vfov, e, this._near, this._far), this._valid = !0
        },
        _invalidate: function() {
            this._valid = !1
        }
    }, t.exports = r
}, function(t, e, n) {
    function r() {
        this._near = .01, this._far = 10, this._xMin = -1, this._xMax = 1, this._yMin = -1, this._yMax = 1, this._proj = i.create(), this._valid = !1
    }
    var i = n(22);
    r.prototype = {
        getProjection: function() {
            return this._valid || this._updateProjection(), this._proj
        },
        setBound: function(t, e, n, r) {
            this._xMin = t, this._xMax = e, this._yMin = n, this._yMax = r, this._invalidate()
        },
        set near(t) {
            this._near !== t && (this._near = t, this._invalidate())
        },
        get near() {
            return this._near
        },
        set far(t) {
            this._far !== t && (this._far = t, this._invalidate())
        },
        get far() {
            return this._far
        },
        set aspect(t) {
            this._aspect !== t && (this._aspect = t)
        },
        get aspect() {
            return this._aspect
        },
        _updateProjection: function() {
            i.ortho(this._proj, this._xMin, this._xMax, this._yMin, this._yMax, this._near, this._far), this._valid = !0
        },
        _invalidate: function() {
            this._valid = !1
        }
    }, t.exports = r
}, function(t, e, n) {
    "use strict";

    function r(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i, o, a = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        s = n(27),
        u = n(37),
        l = s.vec3.create(),
        c = [0, 0],
        h = Math.PI / 2 - .5,
        f = 2 * Math.PI,
        d = 0,
        p = 0,
        _ = 0,
        m = 0,
        v = function() {
            function t(e) {
                r(this, t), this.domEl = e || window, this.radius = 10, this.minRadius = .1, this.maxRadius = 500, this._onMouseWheel = this.__onMouseWheel.bind(this), this._onMouseDown = this.__onMouseDown.bind(this), this._onMouseMove = this.__onMouseMove.bind(this), this._onMouseUp = this.__onMouseUp.bind(this), this._onContextMenu = this.__onContextMenu.bind(this), this.target = s.vec3.create()
            }
            return a(t, [{
                key: "addListeners",
                value: function() {
                    this.domEl.addEventListener("mousedown", this._onMouseDown), this.domEl.addEventListener("mousewheel", this._onMouseWheel), this.domEl.addEventListener("DOMMouseScroll", this._onMouseWheel), document.addEventListener("contextmenu", this._onContextMenu)
                }
            }, {
                key: "removeListeners",
                value: function() {
                    this.domEl.removeEventListener("mousedown", this._onMouseDown), this.domEl.removeEventListener("mousewheel", this._onMouseWheel), this.domEl.removeEventListener("DOMMouseScroll", this._onMouseWheel), document.removeEventListener("contextmenu", this._onContextMenu)
                }
            }, {
                key: "start",
                value: function(t) {
                    this.addListeners(), this.node = t
                }
            }, {
                key: "update",
                value: function() {
                    var t = this.radius * Math.sin(h + _) * Math.sin(f + m),
                        e = this.radius * Math.cos(h + _),
                        n = this.radius * Math.sin(h + _) * Math.cos(f + m);
                    this.node.position[0] = t, this.node.position[1] = e, this.node.position[2] = n, this.node.lookAt(this.target)
                }
            }, {
                key: "stop",
                value: function() {
                    this.removeListeners(), this.el = null, this.node = null
                }
            }, {
                key: "__onMouseDown",
                value: function(t) {
                    c[0] = t.pageX, c[1] = t.pageY;
                    var e = this.node.position;
                    i = s.vec3.fromValues(e.x, e.y, e.z), o = s.vec3.clone(l), d = h, p = f, this.domEl.addEventListener("mousemove", this._onMouseMove), this.domEl.addEventListener("mouseup", this._onMouseUp)
                }
            }, {
                key: "__onMouseMove",
                value: function(t) {
                    return 0 === t.button ? this._handleRotation(t) : this._handlePanning(t), !1
                }
            }, {
                key: "__onMouseUp",
                value: function() {
                    this.domEl.removeEventListener("mousemove", this._onMouseMove), this.domEl.removeEventListener("mouseup", this._onMouseUp)
                }
            }, {
                key: "__onMouseWheel",
                value: function(t) {
                    var e = t.wheelDelta ? -t.wheelDelta / 1e3 : t.detail / 10;
                    this.radius += e, this.radius = u.limit(this.radius, this.minRadius, this.maxRadius)
                }
            }, {
                key: "__onContextMenu",
                value: function(t) {
                    return 2 === t.button ? (t.preventDefault(), this.__onMouseDown(t), !1) : void 0
                }
            }, {
                key: "_handleRotation",
                value: function(t) {
                    var e = .01 * (c[0] - t.pageX),
                        n = .01 * (c[1] - t.pageY);
                    h = d + n, f = p + e, h < Math.PI || (h = Math.PI), h > .001 || (h = .001), f >= 2 * Math.PI, f > 0 || (f = 2 * Math.PI)
                }
            }, {
                key: "_handlePanning",
                value: function(t) {
                    var e = .01 * (c[0] - t.pageX),
                        n = .01 * (c[1] - t.pageY);
                    s.vec3.set(l, o[0] - e, o[1] - n, o[2]), s.vec3.set(this.node.position, i[0] - e, i[1] - n, i[2])
                }
            }, {
                key: "phi",
                get: function() {
                    return h
                },
                set: function(t) {
                    h = t
                }
            }, {
                key: "theta",
                get: function() {
                    return f
                },
                set: function(t) {
                    f = t
                }
            }, {
                key: "phiOffset",
                get: function() {
                    return _
                },
                set: function(t) {
                    _ = t
                }
            }, {
                key: "thetaOffset",
                get: function() {
                    return m
                },
                set: function(t) {
                    m = t
                }
            }]), t
        }();
    e.default = v
}, function(t, e, n) {
    e.glMatrix = n(28), e.mat2 = n(29), e.mat2d = n(30), e.mat3 = n(31), e.mat4 = n(32), e.quat = n(33), e.vec2 = n(36), e.vec3 = n(34), e.vec4 = n(35)
}, function(t) {
    var e = {};
    e.EPSILON = 1e-6, e.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, e.RANDOM = Math.random, e.ENABLE_SIMD = !1, e.SIMD_AVAILABLE = e.ARRAY_TYPE === Float32Array && "SIMD" in this, e.USE_SIMD = e.ENABLE_SIMD && e.SIMD_AVAILABLE, e.setMatrixArrayType = function(t) {
        e.ARRAY_TYPE = t
    };
    var n = Math.PI / 180;
    e.toRadian = function(t) {
        return t * n
    }, e.equals = function(t, n) {
        return Math.abs(t - n) <= e.EPSILON * Math.max(1, Math.abs(t), Math.abs(n))
    }, t.exports = e
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(4);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(4);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, i.fromValues = function(t, e, n, i) {
        var o = new r.ARRAY_TYPE(4);
        return o[0] = t, o[1] = e, o[2] = n, o[3] = i, o
    }, i.set = function(t, e, n, r, i) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t
    }, i.transpose = function(t, e) {
        if (t === e) {
            var n = e[1];
            t[1] = e[2], t[2] = n
        } else t[0] = e[0], t[1] = e[2], t[2] = e[1], t[3] = e[3];
        return t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n * o - i * r;
        return a ? (a = 1 / a, t[0] = o * a, t[1] = -r * a, t[2] = -i * a, t[3] = n * a, t) : null
    }, i.adjoint = function(t, e) {
        var n = e[0];
        return t[0] = e[3], t[1] = -e[1], t[2] = -e[2], t[3] = n, t
    }, i.determinant = function(t) {
        return t[0] * t[3] - t[2] * t[1]
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = n[0],
            u = n[1],
            l = n[2],
            c = n[3];
        return t[0] = r * s + o * u, t[1] = i * s + a * u, t[2] = r * l + o * c, t[3] = i * l + a * c, t
    }, i.mul = i.multiply, i.rotate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u + o * s, t[1] = i * u + a * s, t[2] = r * -s + o * u, t[3] = i * -s + a * u, t
    }, i.scale = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = n[0],
            u = n[1];
        return t[0] = r * s, t[1] = i * s, t[2] = o * u, t[3] = a * u, t
    }, i.fromRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t
    }, i.str = function(t) {
        return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
    }, i.LDU = function(t, e, n, r) {
        return t[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - t[2] * n[1], [t, e, n]
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
    }, i.sub = i.subtract, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = t[3],
            s = e[0],
            u = e[1],
            l = e[2],
            c = e[3];
        return !(Math.abs(n - s) > r.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) || Math.abs(i - u) > r.EPSILON * Math.max(1, Math.abs(i), Math.abs(u)) || Math.abs(o - l) > r.EPSILON * Math.max(1, Math.abs(o), Math.abs(l)) || Math.abs(a - c) > r.EPSILON * Math.max(1, Math.abs(a), Math.abs(c)))
    }, i.multiplyScalar = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
    }, i.multiplyScalarAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(6);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(6);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
    }, i.fromValues = function(t, e, n, i, o, a) {
        var s = new r.ARRAY_TYPE(6);
        return s[0] = t, s[1] = e, s[2] = n, s[3] = i, s[4] = o, s[5] = a, s
    }, i.set = function(t, e, n, r, i, o, a) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t[4] = o, t[5] = a, t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = n * o - r * i;
        return u ? (u = 1 / u, t[0] = o * u, t[1] = -r * u, t[2] = -i * u, t[3] = n * u, t[4] = (i * s - o * a) * u, t[5] = (r * a - n * s) * u, t) : null
    }, i.determinant = function(t) {
        return t[0] * t[3] - t[1] * t[2]
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = n[0],
            c = n[1],
            h = n[2],
            f = n[3],
            d = n[4],
            p = n[5];
        return t[0] = r * l + o * c, t[1] = i * l + a * c, t[2] = r * h + o * f, t[3] = i * h + a * f, t[4] = r * d + o * p + s, t[5] = i * d + a * p + u, t
    }, i.mul = i.multiply, i.rotate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = Math.sin(n),
            c = Math.cos(n);
        return t[0] = r * c + o * l, t[1] = i * c + a * l, t[2] = r * -l + o * c, t[3] = i * -l + a * c, t[4] = s, t[5] = u, t
    }, i.scale = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = n[0],
            c = n[1];
        return t[0] = r * l, t[1] = i * l, t[2] = o * c, t[3] = a * c, t[4] = s, t[5] = u, t
    }, i.translate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = n[0],
            c = n[1];
        return t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = r * l + o * c + s, t[5] = i * l + a * c + u, t
    }, i.fromRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t[4] = 0, t[5] = 0, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t[4] = 0, t[5] = 0, t
    }, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = e[0], t[5] = e[1], t
    }, i.str = function(t) {
        return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t
    }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t
    }, i.multiplyScalarAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t[4] = e[4] + n[4] * r, t[5] = e[5] + n[5] * r, t
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = t[3],
            s = t[4],
            u = t[5],
            l = e[0],
            c = e[1],
            h = e[2],
            f = e[3],
            d = e[4],
            p = e[5];
        return !(Math.abs(n - l) > r.EPSILON * Math.max(1, Math.abs(n), Math.abs(l)) || Math.abs(i - c) > r.EPSILON * Math.max(1, Math.abs(i), Math.abs(c)) || Math.abs(o - h) > r.EPSILON * Math.max(1, Math.abs(o), Math.abs(h)) || Math.abs(a - f) > r.EPSILON * Math.max(1, Math.abs(a), Math.abs(f)) || Math.abs(s - d) > r.EPSILON * Math.max(1, Math.abs(s), Math.abs(d)) || Math.abs(u - p) > r.EPSILON * Math.max(1, Math.abs(u), Math.abs(p)))
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(9);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromMat4 = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(9);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
    }, i.fromValues = function(t, e, n, i, o, a, s, u, l) {
        var c = new r.ARRAY_TYPE(9);
        return c[0] = t, c[1] = e, c[2] = n, c[3] = i, c[4] = o, c[5] = a, c[6] = s, c[7] = u, c[8] = l, c
    }, i.set = function(t, e, n, r, i, o, a, s, u, l) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t[4] = o, t[5] = a, t[6] = s, t[7] = u, t[8] = l, t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.transpose = function(t, e) {
        if (t === e) {
            var n = e[1],
                r = e[2],
                i = e[5];
            t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = r, t[7] = i
        } else t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8];
        return t
    }, i.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = c * a - s * l,
            f = -c * o + s * u,
            d = l * o - a * u,
            p = n * h + r * f + i * d;
        return p ? (p = 1 / p, t[0] = h * p, t[1] = (-c * r + i * l) * p, t[2] = (s * r - i * a) * p, t[3] = f * p, t[4] = (c * n - i * u) * p, t[5] = (-s * n + i * o) * p, t[6] = d * p, t[7] = (-l * n + r * u) * p, t[8] = (a * n - r * o) * p, t) : null
    }, i.adjoint = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8];
        return t[0] = a * c - s * l, t[1] = i * l - r * c, t[2] = r * s - i * a, t[3] = s * u - o * c, t[4] = n * c - i * u, t[5] = i * o - n * s, t[6] = o * l - a * u, t[7] = r * u - n * l, t[8] = n * a - r * o, t
    }, i.determinant = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3],
            o = t[4],
            a = t[5],
            s = t[6],
            u = t[7],
            l = t[8];
        return e * (l * o - a * u) + n * (-l * i + a * s) + r * (u * i - o * s)
    }, i.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = n[0],
            d = n[1],
            p = n[2],
            _ = n[3],
            m = n[4],
            v = n[5],
            M = n[6],
            g = n[7],
            b = n[8];
        return t[0] = f * r + d * a + p * l, t[1] = f * i + d * s + p * c, t[2] = f * o + d * u + p * h, t[3] = _ * r + m * a + v * l, t[4] = _ * i + m * s + v * c, t[5] = _ * o + m * u + v * h, t[6] = M * r + g * a + b * l, t[7] = M * i + g * s + b * c, t[8] = M * o + g * u + b * h, t
    }, i.mul = i.multiply, i.translate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = n[0],
            d = n[1];
        return t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = s, t[5] = u, t[6] = f * r + d * a + l, t[7] = f * i + d * s + c, t[8] = f * o + d * u + h, t
    }, i.rotate = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = Math.sin(n),
            d = Math.cos(n);
        return t[0] = d * r + f * a, t[1] = d * i + f * s, t[2] = d * o + f * u, t[3] = d * a - f * r, t[4] = d * s - f * i, t[5] = d * u - f * o, t[6] = l, t[7] = c, t[8] = h, t
    }, i.scale = function(t, e, n) {
        var r = n[0],
            i = n[1];
        return t[0] = r * e[0], t[1] = r * e[1], t[2] = r * e[2], t[3] = i * e[3], t[4] = i * e[4], t[5] = i * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
    }, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t
    }, i.fromRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = 0, t[3] = -n, t[4] = r, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }, i.fromMat2d = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t
    }, i.fromQuat = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n + n,
            s = r + r,
            u = i + i,
            l = n * a,
            c = r * a,
            h = r * s,
            f = i * a,
            d = i * s,
            p = i * u,
            _ = o * a,
            m = o * s,
            v = o * u;
        return t[0] = 1 - h - p, t[3] = c - v, t[6] = f + m, t[1] = c + v, t[4] = 1 - l - p, t[7] = d - _, t[2] = f - m, t[5] = d + _, t[8] = 1 - l - h, t
    }, i.normalFromMat4 = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15],
            M = n * s - r * a,
            g = n * u - i * a,
            b = n * l - o * a,
            x = r * u - i * s,
            y = r * l - o * s,
            w = i * l - o * u,
            S = c * _ - h * p,
            I = c * m - f * p,
            E = c * v - d * p,
            D = h * m - f * _,
            A = h * v - d * _,
            F = f * v - d * m,
            P = M * F - g * A + b * D + x * E - y * I + w * S;
        return P ? (P = 1 / P, t[0] = (s * F - u * A + l * D) * P, t[1] = (u * E - a * F - l * I) * P, t[2] = (a * A - s * E + l * S) * P, t[3] = (i * A - r * F - o * D) * P, t[4] = (n * F - i * E + o * I) * P, t[5] = (r * E - n * A - o * S) * P, t[6] = (_ * w - m * y + v * x) * P, t[7] = (m * b - p * w - v * g) * P, t[8] = (p * y - _ * b + v * M) * P, t) : null
    }, i.str = function(t) {
        return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t
    }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t
    }, i.multiplyScalarAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t[4] = e[4] + n[4] * r, t[5] = e[5] + n[5] * r, t[6] = e[6] + n[6] * r, t[7] = e[7] + n[7] * r, t[8] = e[8] + n[8] * r, t
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = t[3],
            s = t[4],
            u = t[5],
            l = t[6],
            c = t[7],
            h = t[8],
            f = e[0],
            d = e[1],
            p = e[2],
            _ = e[3],
            m = e[4],
            v = e[5],
            M = t[6],
            g = e[7],
            b = e[8];
        return !(Math.abs(n - f) > r.EPSILON * Math.max(1, Math.abs(n), Math.abs(f)) || Math.abs(i - d) > r.EPSILON * Math.max(1, Math.abs(i), Math.abs(d)) || Math.abs(o - p) > r.EPSILON * Math.max(1, Math.abs(o), Math.abs(p)) || Math.abs(a - _) > r.EPSILON * Math.max(1, Math.abs(a), Math.abs(_)) || Math.abs(s - m) > r.EPSILON * Math.max(1, Math.abs(s), Math.abs(m)) || Math.abs(u - v) > r.EPSILON * Math.max(1, Math.abs(u), Math.abs(v)) || Math.abs(l - M) > r.EPSILON * Math.max(1, Math.abs(l), Math.abs(M)) || Math.abs(c - g) > r.EPSILON * Math.max(1, Math.abs(c), Math.abs(g)) || Math.abs(h - b) > r.EPSILON * Math.max(1, Math.abs(h), Math.abs(b)))
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = {
            scalar: {},
            SIMD: {}
        };
    i.create = function() {
        var t = new r.ARRAY_TYPE(16);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(16);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.fromValues = function(t, e, n, i, o, a, s, u, l, c, h, f, d, p, _, m) {
        var v = new r.ARRAY_TYPE(16);
        return v[0] = t, v[1] = e, v[2] = n, v[3] = i, v[4] = o, v[5] = a, v[6] = s, v[7] = u, v[8] = l, v[9] = c, v[10] = h, v[11] = f, v[12] = d, v[13] = p, v[14] = _, v[15] = m, v
    }, i.set = function(t, e, n, r, i, o, a, s, u, l, c, h, f, d, p, _, m) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t[4] = o, t[5] = a, t[6] = s, t[7] = u, t[8] = l, t[9] = c, t[10] = h, t[11] = f, t[12] = d, t[13] = p, t[14] = _, t[15] = m, t
    }, i.identity = function(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.scalar.transpose = function(t, e) {
        if (t === e) {
            var n = e[1],
                r = e[2],
                i = e[3],
                o = e[6],
                a = e[7],
                s = e[11];
            t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = r, t[9] = o, t[11] = e[14], t[12] = i, t[13] = a, t[14] = s
        } else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
        return t
    }, i.SIMD.transpose = function(t, e) {
        var n, r, i, o, a, s, u, l, c, h;
        return n = SIMD.Float32x4.load(e, 0), r = SIMD.Float32x4.load(e, 4), i = SIMD.Float32x4.load(e, 8), o = SIMD.Float32x4.load(e, 12), a = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), s = SIMD.Float32x4.shuffle(i, o, 0, 1, 4, 5), u = SIMD.Float32x4.shuffle(a, s, 0, 2, 4, 6), l = SIMD.Float32x4.shuffle(a, s, 1, 3, 5, 7), SIMD.Float32x4.store(t, 0, u), SIMD.Float32x4.store(t, 4, l), a = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), s = SIMD.Float32x4.shuffle(i, o, 2, 3, 6, 7), c = SIMD.Float32x4.shuffle(a, s, 0, 2, 4, 6), h = SIMD.Float32x4.shuffle(a, s, 1, 3, 5, 7), SIMD.Float32x4.store(t, 8, c), SIMD.Float32x4.store(t, 12, h), t
    }, i.transpose = r.USE_SIMD ? i.SIMD.transpose : i.scalar.transpose, i.scalar.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15],
            M = n * s - r * a,
            g = n * u - i * a,
            b = n * l - o * a,
            x = r * u - i * s,
            y = r * l - o * s,
            w = i * l - o * u,
            S = c * _ - h * p,
            I = c * m - f * p,
            E = c * v - d * p,
            D = h * m - f * _,
            A = h * v - d * _,
            F = f * v - d * m,
            P = M * F - g * A + b * D + x * E - y * I + w * S;
        return P ? (P = 1 / P, t[0] = (s * F - u * A + l * D) * P, t[1] = (i * A - r * F - o * D) * P, t[2] = (_ * w - m * y + v * x) * P, t[3] = (f * y - h * w - d * x) * P, t[4] = (u * E - a * F - l * I) * P, t[5] = (n * F - i * E + o * I) * P, t[6] = (m * b - p * w - v * g) * P, t[7] = (c * w - f * b + d * g) * P, t[8] = (a * A - s * E + l * S) * P, t[9] = (r * E - n * A - o * S) * P, t[10] = (p * y - _ * b + v * M) * P, t[11] = (h * b - c * y - d * M) * P, t[12] = (s * I - a * D - u * S) * P, t[13] = (n * D - r * I + i * S) * P, t[14] = (_ * g - p * x - m * M) * P, t[15] = (c * x - h * g + f * M) * P, t) : null
    }, i.SIMD.invert = function(t, e) {
        var n, r, i, o, a, s, u, l, c, h, f = SIMD.Float32x4.load(e, 0),
            d = SIMD.Float32x4.load(e, 4),
            p = SIMD.Float32x4.load(e, 8),
            _ = SIMD.Float32x4.load(e, 12);
        return a = SIMD.Float32x4.shuffle(f, d, 0, 1, 4, 5), r = SIMD.Float32x4.shuffle(p, _, 0, 1, 4, 5), n = SIMD.Float32x4.shuffle(a, r, 0, 2, 4, 6), r = SIMD.Float32x4.shuffle(r, a, 1, 3, 5, 7), a = SIMD.Float32x4.shuffle(f, d, 2, 3, 6, 7), o = SIMD.Float32x4.shuffle(p, _, 2, 3, 6, 7), i = SIMD.Float32x4.shuffle(a, o, 0, 2, 4, 6), o = SIMD.Float32x4.shuffle(o, a, 1, 3, 5, 7), a = SIMD.Float32x4.mul(i, o), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), s = SIMD.Float32x4.mul(r, a), u = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, a), s), u = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), a = SIMD.Float32x4.mul(r, i), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, a), s), c = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(o, a)), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), a = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), o), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, a), s), l = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(i, a)), l = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), l), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), a = SIMD.Float32x4.mul(n, r), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), l = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, a), l), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, a), c), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), l = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, a), l), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(i, a)), a = SIMD.Float32x4.mul(n, o), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(i, a)), l = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, a), l), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, a), u), l = SIMD.Float32x4.sub(l, SIMD.Float32x4.mul(r, a)), a = SIMD.Float32x4.mul(n, i), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, a), u), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(r, a)), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(o, a)), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, a), c), h = SIMD.Float32x4.mul(n, s), h = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(h, 2, 3, 0, 1), h), h = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(h, 1, 0, 3, 2), h), a = SIMD.Float32x4.reciprocalApproximation(h), h = SIMD.Float32x4.sub(SIMD.Float32x4.add(a, a), SIMD.Float32x4.mul(h, SIMD.Float32x4.mul(a, a))), (h = SIMD.Float32x4.swizzle(h, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(h, s)), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(h, u)), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(h, l)), SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(h, c)), t) : null
    }, i.invert = r.USE_SIMD ? i.SIMD.invert : i.scalar.invert, i.scalar.adjoint = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = e[4],
            s = e[5],
            u = e[6],
            l = e[7],
            c = e[8],
            h = e[9],
            f = e[10],
            d = e[11],
            p = e[12],
            _ = e[13],
            m = e[14],
            v = e[15];
        return t[0] = s * (f * v - d * m) - h * (u * v - l * m) + _ * (u * d - l * f), t[1] = -(r * (f * v - d * m) - h * (i * v - o * m) + _ * (i * d - o * f)), t[2] = r * (u * v - l * m) - s * (i * v - o * m) + _ * (i * l - o * u), t[3] = -(r * (u * d - l * f) - s * (i * d - o * f) + h * (i * l - o * u)), t[4] = -(a * (f * v - d * m) - c * (u * v - l * m) + p * (u * d - l * f)), t[5] = n * (f * v - d * m) - c * (i * v - o * m) + p * (i * d - o * f), t[6] = -(n * (u * v - l * m) - a * (i * v - o * m) + p * (i * l - o * u)), t[7] = n * (u * d - l * f) - a * (i * d - o * f) + c * (i * l - o * u), t[8] = a * (h * v - d * _) - c * (s * v - l * _) + p * (s * d - l * h), t[9] = -(n * (h * v - d * _) - c * (r * v - o * _) + p * (r * d - o * h)), t[10] = n * (s * v - l * _) - a * (r * v - o * _) + p * (r * l - o * s), t[11] = -(n * (s * d - l * h) - a * (r * d - o * h) + c * (r * l - o * s)), t[12] = -(a * (h * m - f * _) - c * (s * m - u * _) + p * (s * f - u * h)), t[13] = n * (h * m - f * _) - c * (r * m - i * _) + p * (r * f - i * h), t[14] = -(n * (s * m - u * _) - a * (r * m - i * _) + p * (r * u - i * s)), t[15] = n * (s * f - u * h) - a * (r * f - i * h) + c * (r * u - i * s), t
    }, i.SIMD.adjoint = function(t, e) {
        var n, r, i, o, a, s, u, l, c, h, f, d, p, n = SIMD.Float32x4.load(e, 0),
            r = SIMD.Float32x4.load(e, 4),
            i = SIMD.Float32x4.load(e, 8),
            o = SIMD.Float32x4.load(e, 12);
        return c = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), s = SIMD.Float32x4.shuffle(i, o, 0, 1, 4, 5), a = SIMD.Float32x4.shuffle(c, s, 0, 2, 4, 6), s = SIMD.Float32x4.shuffle(s, c, 1, 3, 5, 7), c = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), l = SIMD.Float32x4.shuffle(i, o, 2, 3, 6, 7), u = SIMD.Float32x4.shuffle(c, l, 0, 2, 4, 6), l = SIMD.Float32x4.shuffle(l, c, 1, 3, 5, 7), c = SIMD.Float32x4.mul(u, l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), h = SIMD.Float32x4.mul(s, c), f = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), h = SIMD.Float32x4.sub(SIMD.Float32x4.mul(s, c), h), f = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), f), f = SIMD.Float32x4.swizzle(f, 2, 3, 0, 1), c = SIMD.Float32x4.mul(s, u), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), h), p = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(l, c)), p = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), p), p = SIMD.Float32x4.swizzle(p, 2, 3, 0, 1), c = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), h), d = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(u, c)), d = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), d), d = SIMD.Float32x4.swizzle(d, 2, 3, 0, 1), c = SIMD.Float32x4.mul(a, s), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), d = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), d), p = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, c), p), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), d = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, c), d), p = SIMD.Float32x4.sub(p, SIMD.Float32x4.mul(u, c)), c = SIMD.Float32x4.mul(a, l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(u, c)), d = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), d), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), f = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), f), d = SIMD.Float32x4.sub(d, SIMD.Float32x4.mul(s, c)), c = SIMD.Float32x4.mul(a, u), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), f = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), f), p = SIMD.Float32x4.sub(p, SIMD.Float32x4.mul(s, c)), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(l, c)), p = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), p), SIMD.Float32x4.store(t, 0, h), SIMD.Float32x4.store(t, 4, f), SIMD.Float32x4.store(t, 8, d), SIMD.Float32x4.store(t, 12, p), t
    }, i.adjoint = r.USE_SIMD ? i.SIMD.adjoint : i.scalar.adjoint, i.determinant = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3],
            o = t[4],
            a = t[5],
            s = t[6],
            u = t[7],
            l = t[8],
            c = t[9],
            h = t[10],
            f = t[11],
            d = t[12],
            p = t[13],
            _ = t[14],
            m = t[15],
            v = e * a - n * o,
            M = e * s - r * o,
            g = e * u - i * o,
            b = n * s - r * a,
            x = n * u - i * a,
            y = r * u - i * s,
            w = l * p - c * d,
            S = l * _ - h * d,
            I = l * m - f * d,
            E = c * _ - h * p,
            D = c * m - f * p,
            A = h * m - f * _;
        return v * A - M * D + g * E + b * I - x * S + y * w
    }, i.SIMD.multiply = function(t, e, n) {
        var r = SIMD.Float32x4.load(e, 0),
            i = SIMD.Float32x4.load(e, 4),
            o = SIMD.Float32x4.load(e, 8),
            a = SIMD.Float32x4.load(e, 12),
            s = SIMD.Float32x4.load(n, 0),
            u = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 3, 3, 3, 3), a))));
        SIMD.Float32x4.store(t, 0, u);
        var l = SIMD.Float32x4.load(n, 4),
            c = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 3, 3, 3, 3), a))));
        SIMD.Float32x4.store(t, 4, c);
        var h = SIMD.Float32x4.load(n, 8),
            f = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 3, 3, 3, 3), a))));
        SIMD.Float32x4.store(t, 8, f);
        var d = SIMD.Float32x4.load(n, 12),
            p = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 3, 3, 3, 3), a))));
        return SIMD.Float32x4.store(t, 12, p), t
    }, i.scalar.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = e[4],
            u = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            f = e[9],
            d = e[10],
            p = e[11],
            _ = e[12],
            m = e[13],
            v = e[14],
            M = e[15],
            g = n[0],
            b = n[1],
            x = n[2],
            y = n[3];
        return t[0] = g * r + b * s + x * h + y * _, t[1] = g * i + b * u + x * f + y * m, t[2] = g * o + b * l + x * d + y * v, t[3] = g * a + b * c + x * p + y * M, g = n[4], b = n[5], x = n[6], y = n[7], t[4] = g * r + b * s + x * h + y * _, t[5] = g * i + b * u + x * f + y * m, t[6] = g * o + b * l + x * d + y * v, t[7] = g * a + b * c + x * p + y * M, g = n[8], b = n[9], x = n[10], y = n[11], t[8] = g * r + b * s + x * h + y * _, t[9] = g * i + b * u + x * f + y * m, t[10] = g * o + b * l + x * d + y * v, t[11] = g * a + b * c + x * p + y * M, g = n[12], b = n[13], x = n[14], y = n[15], t[12] = g * r + b * s + x * h + y * _, t[13] = g * i + b * u + x * f + y * m, t[14] = g * o + b * l + x * d + y * v, t[15] = g * a + b * c + x * p + y * M, t
    }, i.multiply = r.USE_SIMD ? i.SIMD.multiply : i.scalar.multiply, i.mul = i.multiply, i.scalar.translate = function(t, e, n) {
        var r, i, o, a, s, u, l, c, h, f, d, p, _ = n[0],
            m = n[1],
            v = n[2];
        return e === t ? (t[12] = e[0] * _ + e[4] * m + e[8] * v + e[12], t[13] = e[1] * _ + e[5] * m + e[9] * v + e[13], t[14] = e[2] * _ + e[6] * m + e[10] * v + e[14], t[15] = e[3] * _ + e[7] * m + e[11] * v + e[15]) : (r = e[0], i = e[1], o = e[2], a = e[3], s = e[4], u = e[5], l = e[6], c = e[7], h = e[8], f = e[9], d = e[10], p = e[11], t[0] = r, t[1] = i, t[2] = o, t[3] = a, t[4] = s, t[5] = u, t[6] = l, t[7] = c, t[8] = h, t[9] = f, t[10] = d, t[11] = p, t[12] = r * _ + s * m + h * v + e[12], t[13] = i * _ + u * m + f * v + e[13], t[14] = o * _ + l * m + d * v + e[14], t[15] = a * _ + c * m + p * v + e[15]), t
    }, i.SIMD.translate = function(t, e, n) {
        var r = SIMD.Float32x4.load(e, 0),
            i = SIMD.Float32x4.load(e, 4),
            o = SIMD.Float32x4.load(e, 8),
            a = SIMD.Float32x4.load(e, 12),
            s = SIMD.Float32x4(n[0], n[1], n[2], 0);
        e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11]), r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(s, 0, 0, 0, 0)), i = SIMD.Float32x4.mul(i, SIMD.Float32x4.swizzle(s, 1, 1, 1, 1)), o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(s, 2, 2, 2, 2));
        var u = SIMD.Float32x4.add(r, SIMD.Float32x4.add(i, SIMD.Float32x4.add(o, a)));
        return SIMD.Float32x4.store(t, 12, u), t
    }, i.translate = r.USE_SIMD ? i.SIMD.translate : i.scalar.translate, i.scalar.scale = function(t, e, n) {
        var r = n[0],
            i = n[1],
            o = n[2];
        return t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r, t[3] = e[3] * r, t[4] = e[4] * i, t[5] = e[5] * i, t[6] = e[6] * i, t[7] = e[7] * i, t[8] = e[8] * o, t[9] = e[9] * o, t[10] = e[10] * o, t[11] = e[11] * o, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.SIMD.scale = function(t, e, n) {
        var r, i, o, a = SIMD.Float32x4(n[0], n[1], n[2], 0);
        return r = SIMD.Float32x4.load(e, 0), SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(a, 0, 0, 0, 0))), i = SIMD.Float32x4.load(e, 4), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(i, SIMD.Float32x4.swizzle(a, 1, 1, 1, 1))), o = SIMD.Float32x4.load(e, 8), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(a, 2, 2, 2, 2))), t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
    }, i.scale = r.USE_SIMD ? i.SIMD.scale : i.scalar.scale, i.rotate = function(t, e, n, i) {
        var o, a, s, u, l, c, h, f, d, p, _, m, v, M, g, b, x, y, w, S, I, E, D, A, F = i[0],
            P = i[1],
            C = i[2],
            T = Math.sqrt(F * F + P * P + C * C);
        return Math.abs(T) < r.EPSILON ? null : (T = 1 / T, F *= T, P *= T, C *= T, o = Math.sin(n), a = Math.cos(n), s = 1 - a, u = e[0], l = e[1], c = e[2], h = e[3], f = e[4], d = e[5], p = e[6], _ = e[7], m = e[8], v = e[9], M = e[10], g = e[11], b = F * F * s + a, x = P * F * s + C * o, y = C * F * s - P * o, w = F * P * s - C * o, S = P * P * s + a, I = C * P * s + F * o, E = F * C * s + P * o, D = P * C * s - F * o, A = C * C * s + a, t[0] = u * b + f * x + m * y, t[1] = l * b + d * x + v * y, t[2] = c * b + p * x + M * y, t[3] = h * b + _ * x + g * y, t[4] = u * w + f * S + m * I, t[5] = l * w + d * S + v * I, t[6] = c * w + p * S + M * I, t[7] = h * w + _ * S + g * I, t[8] = u * E + f * D + m * A, t[9] = l * E + d * D + v * A, t[10] = c * E + p * D + M * A, t[11] = h * E + _ * D + g * A, e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t)
    }, i.scalar.rotateX = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[4],
            a = e[5],
            s = e[6],
            u = e[7],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = o * i + l * r, t[5] = a * i + c * r, t[6] = s * i + h * r, t[7] = u * i + f * r, t[8] = l * i - o * r, t[9] = c * i - a * r, t[10] = h * i - s * r, t[11] = f * i - u * r, t
    }, i.SIMD.rotateX = function(t, e, n) {
        var r = SIMD.Float32x4.splat(Math.sin(n)),
            i = SIMD.Float32x4.splat(Math.cos(n));
        e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 4),
            a = SIMD.Float32x4.load(e, 8);
        return SIMD.Float32x4.store(t, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, i), SIMD.Float32x4.mul(a, r))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), SIMD.Float32x4.mul(o, r))), t
    }, i.rotateX = r.USE_SIMD ? i.SIMD.rotateX : i.scalar.rotateX, i.scalar.rotateY = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[8],
            c = e[9],
            h = e[10],
            f = e[11];
        return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i - l * r, t[1] = a * i - c * r, t[2] = s * i - h * r, t[3] = u * i - f * r, t[8] = o * r + l * i, t[9] = a * r + c * i, t[10] = s * r + h * i, t[11] = u * r + f * i, t
    }, i.SIMD.rotateY = function(t, e, n) {
        var r = SIMD.Float32x4.splat(Math.sin(n)),
            i = SIMD.Float32x4.splat(Math.cos(n));
        e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 0),
            a = SIMD.Float32x4.load(e, 8);
        return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, i), SIMD.Float32x4.mul(a, r))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, r), SIMD.Float32x4.mul(a, i))), t
    }, i.rotateY = r.USE_SIMD ? i.SIMD.rotateY : i.scalar.rotateY, i.scalar.rotateZ = function(t, e, n) {
        var r = Math.sin(n),
            i = Math.cos(n),
            o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = e[4],
            c = e[5],
            h = e[6],
            f = e[7];
        return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * i + l * r, t[1] = a * i + c * r, t[2] = s * i + h * r, t[3] = u * i + f * r, t[4] = l * i - o * r, t[5] = c * i - a * r, t[6] = h * i - s * r, t[7] = f * i - u * r, t
    }, i.SIMD.rotateZ = function(t, e, n) {
        var r = SIMD.Float32x4.splat(Math.sin(n)),
            i = SIMD.Float32x4.splat(Math.cos(n));
        e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 0),
            a = SIMD.Float32x4.load(e, 4);
        return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, i), SIMD.Float32x4.mul(a, r))), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), SIMD.Float32x4.mul(o, r))), t
    }, i.rotateZ = r.USE_SIMD ? i.SIMD.rotateZ : i.scalar.rotateZ, i.fromTranslation = function(t, e) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t
    }, i.fromScaling = function(t, e) {
        return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotation = function(t, e, n) {
        var i, o, a, s = n[0],
            u = n[1],
            l = n[2],
            c = Math.sqrt(s * s + u * u + l * l);
        return Math.abs(c) < r.EPSILON ? null : (c = 1 / c, s *= c, u *= c, l *= c, i = Math.sin(e), o = Math.cos(e), a = 1 - o, t[0] = s * s * a + o, t[1] = u * s * a + l * i, t[2] = l * s * a - u * i, t[3] = 0, t[4] = s * u * a - l * i, t[5] = u * u * a + o, t[6] = l * u * a + s * i, t[7] = 0, t[8] = s * l * a + u * i, t[9] = u * l * a - s * i, t[10] = l * l * a + o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
    }, i.fromXRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromYRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromZRotation = function(t, e) {
        var n = Math.sin(e),
            r = Math.cos(e);
        return t[0] = r, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.fromRotationTranslation = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = r + r,
            u = i + i,
            l = o + o,
            c = r * s,
            h = r * u,
            f = r * l,
            d = i * u,
            p = i * l,
            _ = o * l,
            m = a * s,
            v = a * u,
            M = a * l;
        return t[0] = 1 - (d + _), t[1] = h + M, t[2] = f - v, t[3] = 0, t[4] = h - M, t[5] = 1 - (c + _), t[6] = p + m, t[7] = 0, t[8] = f + v, t[9] = p - m, t[10] = 1 - (c + d), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.getTranslation = function(t, e) {
        return t[0] = e[12], t[1] = e[13], t[2] = e[14], t
    }, i.getRotation = function(t, e) {
        var n = e[0] + e[5] + e[10],
            r = 0;
        return n > 0 ? (r = 2 * Math.sqrt(n + 1), t[3] = .25 * r, t[0] = (e[6] - e[9]) / r, t[1] = (e[8] - e[2]) / r, t[2] = (e[1] - e[4]) / r) : e[0] > e[5] & e[0] > e[10] ? (r = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]), t[3] = (e[6] - e[9]) / r, t[0] = .25 * r, t[1] = (e[1] + e[4]) / r, t[2] = (e[8] + e[2]) / r) : e[5] > e[10] ? (r = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]), t[3] = (e[8] - e[2]) / r, t[0] = (e[1] + e[4]) / r, t[1] = .25 * r, t[2] = (e[6] + e[9]) / r) : (r = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]), t[3] = (e[1] - e[4]) / r, t[0] = (e[8] + e[2]) / r, t[1] = (e[6] + e[9]) / r, t[2] = .25 * r), t
    }, i.fromRotationTranslationScale = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2],
            s = e[3],
            u = i + i,
            l = o + o,
            c = a + a,
            h = i * u,
            f = i * l,
            d = i * c,
            p = o * l,
            _ = o * c,
            m = a * c,
            v = s * u,
            M = s * l,
            g = s * c,
            b = r[0],
            x = r[1],
            y = r[2];
        return t[0] = (1 - (p + m)) * b, t[1] = (f + g) * b, t[2] = (d - M) * b, t[3] = 0, t[4] = (f - g) * x, t[5] = (1 - (h + m)) * x, t[6] = (_ + v) * x, t[7] = 0, t[8] = (d + M) * y, t[9] = (_ - v) * y, t[10] = (1 - (h + p)) * y, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
    }, i.fromRotationTranslationScaleOrigin = function(t, e, n, r, i) {
        var o = e[0],
            a = e[1],
            s = e[2],
            u = e[3],
            l = o + o,
            c = a + a,
            h = s + s,
            f = o * l,
            d = o * c,
            p = o * h,
            _ = a * c,
            m = a * h,
            v = s * h,
            M = u * l,
            g = u * c,
            b = u * h,
            x = r[0],
            y = r[1],
            w = r[2],
            S = i[0],
            I = i[1],
            E = i[2];
        return t[0] = (1 - (_ + v)) * x, t[1] = (d + b) * x, t[2] = (p - g) * x, t[3] = 0, t[4] = (d - b) * y, t[5] = (1 - (f + v)) * y, t[6] = (m + M) * y, t[7] = 0, t[8] = (p + g) * w, t[9] = (m - M) * w, t[10] = (1 - (f + _)) * w, t[11] = 0, t[12] = n[0] + S - (t[0] * S + t[4] * I + t[8] * E), t[13] = n[1] + I - (t[1] * S + t[5] * I + t[9] * E), t[14] = n[2] + E - (t[2] * S + t[6] * I + t[10] * E), t[15] = 1, t
    }, i.fromQuat = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n + n,
            s = r + r,
            u = i + i,
            l = n * a,
            c = r * a,
            h = r * s,
            f = i * a,
            d = i * s,
            p = i * u,
            _ = o * a,
            m = o * s,
            v = o * u;
        return t[0] = 1 - h - p, t[1] = c + v, t[2] = f - m, t[3] = 0, t[4] = c - v, t[5] = 1 - l - p, t[6] = d + _, t[7] = 0, t[8] = f + m, t[9] = d - _, t[10] = 1 - l - h, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, i.frustum = function(t, e, n, r, i, o, a) {
        var s = 1 / (n - e),
            u = 1 / (i - r),
            l = 1 / (o - a);
        return t[0] = 2 * o * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * o * u, t[6] = 0, t[7] = 0, t[8] = (n + e) * s, t[9] = (i + r) * u, t[10] = (a + o) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = a * o * 2 * l, t[15] = 0, t
    }, i.perspective = function(t, e, n, r, i) {
        var o = 1 / Math.tan(e / 2),
            a = 1 / (r - i);
        return t[0] = o / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (i + r) * a, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * i * r * a, t[15] = 0, t
    }, i.perspectiveFromFieldOfView = function(t, e, n, r) {
        var i = Math.tan(e.upDegrees * Math.PI / 180),
            o = Math.tan(e.downDegrees * Math.PI / 180),
            a = Math.tan(e.leftDegrees * Math.PI / 180),
            s = Math.tan(e.rightDegrees * Math.PI / 180),
            u = 2 / (a + s),
            l = 2 / (i + o);
        return t[0] = u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = -((a - s) * u * .5), t[9] = (i - o) * l * .5, t[10] = r / (n - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * n / (n - r), t[15] = 0, t
    }, i.ortho = function(t, e, n, r, i, o, a) {
        var s = 1 / (e - n),
            u = 1 / (r - i),
            l = 1 / (o - a);
        return t[0] = -2 * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * l, t[11] = 0, t[12] = (e + n) * s, t[13] = (i + r) * u, t[14] = (a + o) * l, t[15] = 1, t
    }, i.lookAt = function(t, e, n, o) {
        var a, s, u, l, c, h, f, d, p, _, m = e[0],
            v = e[1],
            M = e[2],
            g = o[0],
            b = o[1],
            x = o[2],
            y = n[0],
            w = n[1],
            S = n[2];
        return Math.abs(m - y) < r.EPSILON && Math.abs(v - w) < r.EPSILON && Math.abs(M - S) < r.EPSILON ? i.identity(t) : (f = m - y, d = v - w, p = M - S, _ = 1 / Math.sqrt(f * f + d * d + p * p), f *= _, d *= _, p *= _, a = b * p - x * d, s = x * f - g * p, u = g * d - b * f, _ = Math.sqrt(a * a + s * s + u * u), _ ? (_ = 1 / _, a *= _, s *= _, u *= _) : (a = 0, s = 0, u = 0), l = d * u - p * s, c = p * a - f * u, h = f * s - d * a, _ = Math.sqrt(l * l + c * c + h * h), _ ? (_ = 1 / _, l *= _, c *= _, h *= _) : (l = 0, c = 0, h = 0), t[0] = a, t[1] = l, t[2] = f, t[3] = 0, t[4] = s, t[5] = c, t[6] = d, t[7] = 0, t[8] = u, t[9] = h, t[10] = p, t[11] = 0, t[12] = -(a * m + s * v + u * M), t[13] = -(l * m + c * v + h * M), t[14] = -(f * m + d * v + p * M), t[15] = 1, t)
    }, i.str = function(t) {
        return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
    }, i.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t[9] = e[9] + n[9], t[10] = e[10] + n[10], t[11] = e[11] + n[11], t[12] = e[12] + n[12], t[13] = e[13] + n[13], t[14] = e[14] + n[14], t[15] = e[15] + n[15], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t[9] = e[9] - n[9], t[10] = e[10] - n[10], t[11] = e[11] - n[11], t[12] = e[12] - n[12], t[13] = e[13] - n[13], t[14] = e[14] - n[14], t[15] = e[15] - n[15], t
    }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t[9] = e[9] * n, t[10] = e[10] * n, t[11] = e[11] * n, t[12] = e[12] * n, t[13] = e[13] * n, t[14] = e[14] * n, t[15] = e[15] * n, t
    }, i.multiplyScalarAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t[4] = e[4] + n[4] * r, t[5] = e[5] + n[5] * r, t[6] = e[6] + n[6] * r, t[7] = e[7] + n[7] * r, t[8] = e[8] + n[8] * r, t[9] = e[9] + n[9] * r, t[10] = e[10] + n[10] * r, t[11] = e[11] + n[11] * r, t[12] = e[12] + n[12] * r, t[13] = e[13] + n[13] * r, t[14] = e[14] + n[14] * r, t[15] = e[15] + n[15] * r, t
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[11] === e[11] && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[15] === e[15]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = t[3],
            s = t[4],
            u = t[5],
            l = t[6],
            c = t[7],
            h = t[8],
            f = t[9],
            d = t[10],
            p = t[11],
            _ = t[12],
            m = t[13],
            v = t[14],
            M = t[15],
            g = e[0],
            b = e[1],
            x = e[2],
            y = e[3],
            w = e[4],
            S = e[5],
            I = e[6],
            E = e[7],
            D = e[8],
            A = e[9],
            F = e[10],
            P = e[11],
            C = e[12],
            T = e[13],
            R = e[14],
            O = e[15];
        return !(Math.abs(n - g) > r.EPSILON * Math.max(1, Math.abs(n), Math.abs(g)) || Math.abs(i - b) > r.EPSILON * Math.max(1, Math.abs(i), Math.abs(b)) || Math.abs(o - x) > r.EPSILON * Math.max(1, Math.abs(o), Math.abs(x)) || Math.abs(a - y) > r.EPSILON * Math.max(1, Math.abs(a), Math.abs(y)) || Math.abs(s - w) > r.EPSILON * Math.max(1, Math.abs(s), Math.abs(w)) || Math.abs(u - S) > r.EPSILON * Math.max(1, Math.abs(u), Math.abs(S)) || Math.abs(l - I) > r.EPSILON * Math.max(1, Math.abs(l), Math.abs(I)) || Math.abs(c - E) > r.EPSILON * Math.max(1, Math.abs(c), Math.abs(E)) || Math.abs(h - D) > r.EPSILON * Math.max(1, Math.abs(h), Math.abs(D)) || Math.abs(f - A) > r.EPSILON * Math.max(1, Math.abs(f), Math.abs(A)) || Math.abs(d - F) > r.EPSILON * Math.max(1, Math.abs(d), Math.abs(F)) || Math.abs(p - P) > r.EPSILON * Math.max(1, Math.abs(p), Math.abs(P)) || Math.abs(_ - C) > r.EPSILON * Math.max(1, Math.abs(_), Math.abs(C)) || Math.abs(m - T) > r.EPSILON * Math.max(1, Math.abs(m), Math.abs(T)) || Math.abs(v - R) > r.EPSILON * Math.max(1, Math.abs(v), Math.abs(R)) || Math.abs(M - O) > r.EPSILON * Math.max(1, Math.abs(M), Math.abs(O)))
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = n(31),
        o = n(34),
        a = n(35),
        s = {};
    s.create = function() {
        var t = new r.ARRAY_TYPE(4);
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, s.rotationTo = function() {
        var t = o.create(),
            e = o.fromValues(1, 0, 0),
            n = o.fromValues(0, 1, 0);
        return function(r, i, a) {
            var u = o.dot(i, a);
            return -.999999 > u ? (o.cross(t, e, i), o.length(t) < 1e-6 && o.cross(t, n, i), o.normalize(t, t), s.setAxisAngle(r, t, Math.PI), r) : u > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (o.cross(t, i, a), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + u, s.normalize(r, r))
        }
    }(), s.setAxes = function() {
        var t = i.create();
        return function(e, n, r, i) {
            return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = i[0], t[4] = i[1], t[7] = i[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], s.normalize(e, s.fromMat3(e, t))
        }
    }(), s.clone = a.clone, s.fromValues = a.fromValues, s.copy = a.copy, s.set = a.set, s.identity = function(t) {
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
    }, s.setAxisAngle = function(t, e, n) {
        n = .5 * n;
        var r = Math.sin(n);
        return t[0] = r * e[0], t[1] = r * e[1], t[2] = r * e[2], t[3] = Math.cos(n), t
    }, s.getAxisAngle = function(t, e) {
        var n = 2 * Math.acos(e[3]),
            r = Math.sin(n / 2);
        return 0 != r ? (t[0] = e[0] / r, t[1] = e[1] / r, t[2] = e[2] / r) : (t[0] = 1, t[1] = 0, t[2] = 0), n
    }, s.add = a.add, s.multiply = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = n[0],
            u = n[1],
            l = n[2],
            c = n[3];
        return t[0] = r * c + a * s + i * l - o * u, t[1] = i * c + a * u + o * s - r * l, t[2] = o * c + a * l + r * u - i * s, t[3] = a * c - r * s - i * u - o * l, t
    }, s.mul = s.multiply, s.scale = a.scale, s.rotateX = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u + a * s, t[1] = i * u + o * s, t[2] = o * u - i * s, t[3] = a * u - r * s, t
    }, s.rotateY = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u - o * s, t[1] = i * u + a * s, t[2] = o * u + r * s, t[3] = a * u - i * s, t
    }, s.rotateZ = function(t, e, n) {
        n *= .5;
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3],
            s = Math.sin(n),
            u = Math.cos(n);
        return t[0] = r * u + i * s, t[1] = i * u - r * s, t[2] = o * u + a * s, t[3] = a * u - o * s, t
    }, s.calculateW = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2];
        return t[0] = n, t[1] = r, t[2] = i, t[3] = Math.sqrt(Math.abs(1 - n * n - r * r - i * i)), t
    }, s.dot = a.dot, s.lerp = a.lerp, s.slerp = function(t, e, n, r) {
        var i, o, a, s, u, l = e[0],
            c = e[1],
            h = e[2],
            f = e[3],
            d = n[0],
            p = n[1],
            _ = n[2],
            m = n[3];
        return o = l * d + c * p + h * _ + f * m, 0 > o && (o = -o, d = -d, p = -p, _ = -_, m = -m), 1 - o > 1e-6 ? (i = Math.acos(o), a = Math.sin(i), s = Math.sin((1 - r) * i) / a, u = Math.sin(r * i) / a) : (s = 1 - r, u = r), t[0] = s * l + u * d, t[1] = s * c + u * p, t[2] = s * h + u * _, t[3] = s * f + u * m, t
    }, s.sqlerp = function() {
        var t = s.create(),
            e = s.create();
        return function(n, r, i, o, a, u) {
            return s.slerp(t, r, a, u), s.slerp(e, i, o, u), s.slerp(n, t, e, 2 * u * (1 - u)), n
        }
    }(), s.invert = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n * n + r * r + i * i + o * o,
            s = a ? 1 / a : 0;
        return t[0] = -n * s, t[1] = -r * s, t[2] = -i * s, t[3] = o * s, t
    }, s.conjugate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t
    }, s.length = a.length, s.len = s.length, s.squaredLength = a.squaredLength, s.sqrLen = s.squaredLength, s.normalize = a.normalize, s.fromMat3 = function(t, e) {
        var n, r = e[0] + e[4] + e[8];
        if (r > 0) n = Math.sqrt(r + 1), t[3] = .5 * n, n = .5 / n, t[0] = (e[5] - e[7]) * n, t[1] = (e[6] - e[2]) * n, t[2] = (e[1] - e[3]) * n;
        else {
            var i = 0;
            e[4] > e[0] && (i = 1), e[8] > e[3 * i + i] && (i = 2);
            var o = (i + 1) % 3,
                a = (i + 2) % 3;
            n = Math.sqrt(e[3 * i + i] - e[3 * o + o] - e[3 * a + a] + 1), t[i] = .5 * n, n = .5 / n, t[3] = (e[3 * o + a] - e[3 * a + o]) * n, t[o] = (e[3 * o + i] + e[3 * i + o]) * n, t[a] = (e[3 * a + i] + e[3 * i + a]) * n
        }
        return t
    }, s.str = function(t) {
        return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }, s.exactEquals = a.exactEquals, s.equals = a.equals, t.exports = s
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(3);
        return t[0] = 0, t[1] = 0, t[2] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(3);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e
    }, i.fromValues = function(t, e, n) {
        var i = new r.ARRAY_TYPE(3);
        return i[0] = t, i[1] = e, i[2] = n, i
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t
    }, i.set = function(t, e, n, r) {
        return t[0] = e, t[1] = n, t[2] = r, t
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t
    }, i.sub = i.subtract, i.multiply = function(t, e, n) {
        return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t
    }, i.mul = i.multiply, i.divide = function(t, e, n) {
        return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t
    }, i.div = i.divide, i.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t
    }, i.floor = function(t, e) {
        return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t
    }, i.min = function(t, e, n) {
        return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t
    }, i.max = function(t, e, n) {
        return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t
    }, i.round = function(t, e) {
        return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t[2] = Math.round(e[2]), t
    }, i.scale = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t
    }, i.scaleAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t
    }, i.distance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2];
        return Math.sqrt(n * n + r * r + i * i)
    }, i.dist = i.distance, i.squaredDistance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2];
        return n * n + r * r + i * i
    }, i.sqrDist = i.squaredDistance, i.length = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2];
        return Math.sqrt(e * e + n * n + r * r)
    }, i.len = i.length, i.squaredLength = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2];
        return e * e + n * n + r * r
    }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t
    }, i.inverse = function(t, e) {
        return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t
    }, i.normalize = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = n * n + r * r + i * i;
        return o > 0 && (o = 1 / Math.sqrt(o), t[0] = e[0] * o, t[1] = e[1] * o, t[2] = e[2] * o), t
    }, i.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
    }, i.cross = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2];
        return t[0] = i * u - o * s, t[1] = o * a - r * u, t[2] = r * s - i * a, t
    }, i.lerp = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2];
        return t[0] = i + r * (n[0] - i), t[1] = o + r * (n[1] - o), t[2] = a + r * (n[2] - a), t
    }, i.hermite = function(t, e, n, r, i, o) {
        var a = o * o,
            s = a * (2 * o - 3) + 1,
            u = a * (o - 2) + o,
            l = a * (o - 1),
            c = a * (3 - 2 * o);
        return t[0] = e[0] * s + n[0] * u + r[0] * l + i[0] * c, t[1] = e[1] * s + n[1] * u + r[1] * l + i[1] * c, t[2] = e[2] * s + n[2] * u + r[2] * l + i[2] * c, t
    }, i.bezier = function(t, e, n, r, i, o) {
        var a = 1 - o,
            s = a * a,
            u = o * o,
            l = s * a,
            c = 3 * o * s,
            h = 3 * u * a,
            f = u * o;
        return t[0] = e[0] * l + n[0] * c + r[0] * h + i[0] * f, t[1] = e[1] * l + n[1] * c + r[1] * h + i[1] * f, t[2] = e[2] * l + n[2] * c + r[2] * h + i[2] * f, t
    }, i.random = function(t, e) {
        e = e || 1;
        var n = 2 * r.RANDOM() * Math.PI,
            i = 2 * r.RANDOM() - 1,
            o = Math.sqrt(1 - i * i) * e;
        return t[0] = Math.cos(n) * o, t[1] = Math.sin(n) * o, t[2] = i * e, t
    }, i.transformMat4 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[3] * r + n[7] * i + n[11] * o + n[15];
        return a = a || 1, t[0] = (n[0] * r + n[4] * i + n[8] * o + n[12]) / a, t[1] = (n[1] * r + n[5] * i + n[9] * o + n[13]) / a, t[2] = (n[2] * r + n[6] * i + n[10] * o + n[14]) / a, t
    }, i.transformMat3 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2];
        return t[0] = r * n[0] + i * n[3] + o * n[6], t[1] = r * n[1] + i * n[4] + o * n[7], t[2] = r * n[2] + i * n[5] + o * n[8], t
    }, i.transformQuat = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2],
            l = n[3],
            c = l * r + s * o - u * i,
            h = l * i + u * r - a * o,
            f = l * o + a * i - s * r,
            d = -a * r - s * i - u * o;
        return t[0] = c * l + d * -a + h * -u - f * -s, t[1] = h * l + d * -s + f * -a - c * -u, t[2] = f * l + d * -u + c * -s - h * -a, t
    }, i.rotateX = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[0], o[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), o[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.rotateY = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), o[1] = i[1], o[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.rotateZ = function(t, e, n, r) {
        var i = [],
            o = [];
        return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], o[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), o[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), o[2] = i[2], t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
    }, i.forEach = function() {
        var t = i.create();
        return function(e, n, r, i, o, a) {
            var s, u;
            for (n || (n = 3), r || (r = 0), u = i ? Math.min(i * n + r, e.length) : e.length, s = r; u > s; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], o(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2];
            return e
        }
    }(), i.angle = function(t, e) {
        var n = i.fromValues(t[0], t[1], t[2]),
            r = i.fromValues(e[0], e[1], e[2]);
        i.normalize(n, n), i.normalize(r, r);
        var o = i.dot(n, r);
        return o > 1 ? 0 : Math.acos(o)
    }, i.str = function(t) {
        return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = e[0],
            s = e[1],
            u = e[2];
        return Math.abs(n - a) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(i - s) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(o - u) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(u))
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(4);
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(4);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
    }, i.fromValues = function(t, e, n, i) {
        var o = new r.ARRAY_TYPE(4);
        return o[0] = t, o[1] = e, o[2] = n, o[3] = i, o
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
    }, i.set = function(t, e, n, r, i) {
        return t[0] = e, t[1] = n, t[2] = r, t[3] = i, t
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
    }, i.sub = i.subtract, i.multiply = function(t, e, n) {
        return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t
    }, i.mul = i.multiply, i.divide = function(t, e, n) {
        return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t
    }, i.div = i.divide, i.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t[3] = Math.ceil(e[3]), t
    }, i.floor = function(t, e) {
        return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t[3] = Math.floor(e[3]), t
    }, i.min = function(t, e, n) {
        return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t
    }, i.max = function(t, e, n) {
        return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t
    }, i.round = function(t, e) {
        return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t[2] = Math.round(e[2]), t[3] = Math.round(e[3]), t
    }, i.scale = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
    }, i.scaleAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t[2] = e[2] + n[2] * r, t[3] = e[3] + n[3] * r, t
    }, i.distance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2],
            o = e[3] - t[3];
        return Math.sqrt(n * n + r * r + i * i + o * o)
    }, i.dist = i.distance, i.squaredDistance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1],
            i = e[2] - t[2],
            o = e[3] - t[3];
        return n * n + r * r + i * i + o * o
    }, i.sqrDist = i.squaredDistance, i.length = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3];
        return Math.sqrt(e * e + n * n + r * r + i * i)
    }, i.len = i.length, i.squaredLength = function(t) {
        var e = t[0],
            n = t[1],
            r = t[2],
            i = t[3];
        return e * e + n * n + r * r + i * i
    }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t
    }, i.inverse = function(t, e) {
        return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t[3] = 1 / e[3], t
    }, i.normalize = function(t, e) {
        var n = e[0],
            r = e[1],
            i = e[2],
            o = e[3],
            a = n * n + r * r + i * i + o * o;
        return a > 0 && (a = 1 / Math.sqrt(a), t[0] = n * a, t[1] = r * a, t[2] = i * a, t[3] = o * a), t
    }, i.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
    }, i.lerp = function(t, e, n, r) {
        var i = e[0],
            o = e[1],
            a = e[2],
            s = e[3];
        return t[0] = i + r * (n[0] - i), t[1] = o + r * (n[1] - o), t[2] = a + r * (n[2] - a), t[3] = s + r * (n[3] - s), t
    }, i.random = function(t, e) {
        return e = e || 1, t[0] = r.RANDOM(), t[1] = r.RANDOM(), t[2] = r.RANDOM(), t[3] = r.RANDOM(), i.normalize(t, t), i.scale(t, t, e), t
    }, i.transformMat4 = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = e[3];
        return t[0] = n[0] * r + n[4] * i + n[8] * o + n[12] * a, t[1] = n[1] * r + n[5] * i + n[9] * o + n[13] * a, t[2] = n[2] * r + n[6] * i + n[10] * o + n[14] * a, t[3] = n[3] * r + n[7] * i + n[11] * o + n[15] * a, t
    }, i.transformQuat = function(t, e, n) {
        var r = e[0],
            i = e[1],
            o = e[2],
            a = n[0],
            s = n[1],
            u = n[2],
            l = n[3],
            c = l * r + s * o - u * i,
            h = l * i + u * r - a * o,
            f = l * o + a * i - s * r,
            d = -a * r - s * i - u * o;
        return t[0] = c * l + d * -a + h * -u - f * -s, t[1] = h * l + d * -s + f * -a - c * -u, t[2] = f * l + d * -u + c * -s - h * -a, t[3] = e[3], t
    }, i.forEach = function() {
        var t = i.create();
        return function(e, n, r, i, o, a) {
            var s, u;
            for (n || (n = 4), r || (r = 0), u = i ? Math.min(i * n + r, e.length) : e.length, s = r; u > s; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], t[3] = e[s + 3], o(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2], e[s + 3] = t[3];
            return e
        }
    }(), i.str = function(t) {
        return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = t[2],
            a = t[3],
            s = e[0],
            u = e[1],
            l = e[2],
            c = e[3];
        return !(Math.abs(n - s) > r.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) || Math.abs(i - u) > r.EPSILON * Math.max(1, Math.abs(i), Math.abs(u)) || Math.abs(o - l) > r.EPSILON * Math.max(1, Math.abs(o), Math.abs(l)) || Math.abs(a - c) > r.EPSILON * Math.max(1, Math.abs(a), Math.abs(c)))
    }, t.exports = i
}, function(t, e, n) {
    var r = n(28),
        i = {};
    i.create = function() {
        var t = new r.ARRAY_TYPE(2);
        return t[0] = 0, t[1] = 0, t
    }, i.clone = function(t) {
        var e = new r.ARRAY_TYPE(2);
        return e[0] = t[0], e[1] = t[1], e
    }, i.fromValues = function(t, e) {
        var n = new r.ARRAY_TYPE(2);
        return n[0] = t, n[1] = e, n
    }, i.copy = function(t, e) {
        return t[0] = e[0], t[1] = e[1], t
    }, i.set = function(t, e, n) {
        return t[0] = e, t[1] = n, t
    }, i.add = function(t, e, n) {
        return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t
    }, i.subtract = function(t, e, n) {
        return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t
    }, i.sub = i.subtract, i.multiply = function(t, e, n) {
        return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t
    }, i.mul = i.multiply, i.divide = function(t, e, n) {
        return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t
    }, i.div = i.divide, i.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t
    }, i.floor = function(t, e) {
        return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t
    }, i.min = function(t, e, n) {
        return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t
    }, i.max = function(t, e, n) {
        return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t
    }, i.round = function(t, e) {
        return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t
    }, i.scale = function(t, e, n) {
        return t[0] = e[0] * n, t[1] = e[1] * n, t
    }, i.scaleAndAdd = function(t, e, n, r) {
        return t[0] = e[0] + n[0] * r, t[1] = e[1] + n[1] * r, t
    }, i.distance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1];
        return Math.sqrt(n * n + r * r)
    }, i.dist = i.distance, i.squaredDistance = function(t, e) {
        var n = e[0] - t[0],
            r = e[1] - t[1];
        return n * n + r * r
    }, i.sqrDist = i.squaredDistance, i.length = function(t) {
        var e = t[0],
            n = t[1];
        return Math.sqrt(e * e + n * n)
    }, i.len = i.length, i.squaredLength = function(t) {
        var e = t[0],
            n = t[1];
        return e * e + n * n
    }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
        return t[0] = -e[0], t[1] = -e[1], t
    }, i.inverse = function(t, e) {
        return t[0] = 1 / e[0], t[1] = 1 / e[1], t
    }, i.normalize = function(t, e) {
        var n = e[0],
            r = e[1],
            i = n * n + r * r;
        return i > 0 && (i = 1 / Math.sqrt(i), t[0] = e[0] * i, t[1] = e[1] * i), t
    }, i.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1]
    }, i.cross = function(t, e, n) {
        var r = e[0] * n[1] - e[1] * n[0];
        return t[0] = t[1] = 0, t[2] = r, t
    }, i.lerp = function(t, e, n, r) {
        var i = e[0],
            o = e[1];
        return t[0] = i + r * (n[0] - i), t[1] = o + r * (n[1] - o), t
    }, i.random = function(t, e) {
        e = e || 1;
        var n = 2 * r.RANDOM() * Math.PI;
        return t[0] = Math.cos(n) * e, t[1] = Math.sin(n) * e, t
    }, i.transformMat2 = function(t, e, n) {
        var r = e[0],
            i = e[1];
        return t[0] = n[0] * r + n[2] * i, t[1] = n[1] * r + n[3] * i, t
    }, i.transformMat2d = function(t, e, n) {
        var r = e[0],
            i = e[1];
        return t[0] = n[0] * r + n[2] * i + n[4], t[1] = n[1] * r + n[3] * i + n[5], t
    }, i.transformMat3 = function(t, e, n) {
        var r = e[0],
            i = e[1];
        return t[0] = n[0] * r + n[3] * i + n[6], t[1] = n[1] * r + n[4] * i + n[7], t
    }, i.transformMat4 = function(t, e, n) {
        var r = e[0],
            i = e[1];
        return t[0] = n[0] * r + n[4] * i + n[12], t[1] = n[1] * r + n[5] * i + n[13], t
    }, i.forEach = function() {
        var t = i.create();
        return function(e, n, r, i, o, a) {
            var s, u;
            for (n || (n = 2), r || (r = 0), u = i ? Math.min(i * n + r, e.length) : e.length, s = r; u > s; s += n) t[0] = e[s], t[1] = e[s + 1], o(t, t, a), e[s] = t[0], e[s + 1] = t[1];
            return e
        }
    }(), i.str = function(t) {
        return "vec2(" + t[0] + ", " + t[1] + ")"
    }, i.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1]
    }, i.equals = function(t, e) {
        var n = t[0],
            i = t[1],
            o = e[0],
            a = e[1];
        return Math.abs(n - o) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(i - a) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(a))
    }, t.exports = i
}, function(t, e) {
    "use strict";

    function n(t, e, n) {
        return Math.min(Math.max(e, t), n)
    }

    function r(t, e, n, r, i) {
        var o = (t - e) / (n - e),
            a = o * (i - r) + r;
        return a
    }

    function i(t) {
        return t = "#" == t.substr(0, 1) ? t.substr(1) : t, [parseInt(t.substr(0, 2), 16), parseInt(t.substr(2, 2), 16), parseInt(t.substr(4, 2), 16)]
    }

    function o(t) {
        return t * (Math.PI / 180)
    }

    function a(t) {
        return t * (180 / Math.PI)
    }

    function s(t) {
        return [t[0] / 255, t[1] / 255, t[2] / 255]
    }

    function u(t, e, n) {
        return t * (1 - n) + e * n
    }

    function l(t) {
        return Math.max(0, Math.min(1, t))
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.limit = n, e.map = r, e.hex2rgb = i, e.degreesToRadians = o, e.radianToDegrees = a, e.normalizeRGB = s, e.mix = u, e.clamp = l
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function a(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var s = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        u = n(12),
        l = r(u),
        c = n(13),
        h = r(c),
        f = n(39),
        d = r(f),
        p = n(27),
        _ = p.mat4.create(),
        m = "\n  precision highp float;\n\n  attribute vec2 aPosition;\n\n  uniform mat4 uMVP;\n\n  void main(){\n\n    gl_Position = uMVP * vec4( aPosition, 0.0, 1.0 );\n\n  }\n",
        v = "\n  precision highp float;\n\n  void main(){\n\n    float color = 0.3;\n\n    gl_FragColor = vec4( vec3(color), 1.0 );\n\n  }\n",
        M = function(t) {
            function e(t) {
                i(this, e);
                var n = o(this, Object.getPrototypeOf(e).call(this));
                return n.gl = t, n.initProgram(), n.geometry = new d.default(t), n.geometry.attrib("aPosition", 2, t.FLOAT), n.drawingMethod = "drawLines", n
            }
            return a(e, t), s(e, [{
                key: "initProgram",
                value: function() {
                    this.prg = new l.default(this.gl), this.prg.compile(m, v), this.prg.use()
                }
            }, {
                key: "bind",
                value: function() {
                    this.prg.use(), this.geometry.bind(this.prg)
                }
            }, {
                key: "render",
                value: function(t) {
                    this.bind(), t.modelViewProjectionMatrix(_, this._wmatrix), this.prg.uMVP(_), this.geometry.render()
                }
            }]), e
        }(h.default);
    e.default = M
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function o(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function a(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
    }

    function s(t, e) {
        for (var n = t / e, r = -t / 2; t / 2 >= r; r += n)
            for (var i = -t / 2; t / 2 - n > i; i += n) {
                var o = (Math.floor(10 * i) / 10, Math.floor(10 * r) / 10, parseFloat(i.toFixed(1))),
                    a = parseFloat(r.toFixed(1)),
                    s = parseFloat((i + n).toFixed(1)),
                    u = parseFloat(r.toFixed(1));
                c.push(o), c.push(a), c.push(s), c.push(u)
            }
        for (var i = -t / 2; t / 2 >= i; i += n)
            for (var r = -t / 2; t / 2 - n > r; r += n) {
                var o = parseFloat(i.toFixed(1)),
                    a = parseFloat(r.toFixed(1)),
                    s = parseFloat(i.toFixed(1)),
                    u = parseFloat((r + n).toFixed(1));
                c.push(o), c.push(a), c.push(s), c.push(u)
            }
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var u = n(40),
        l = r(u),
        c = (Float32Array.BYTES_PER_ELEMENT, []),
        h = function(t) {
            function e(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 50;
                i(this, e), s(n, r);
                var a = o(this, Object.getPrototypeOf(e).call(this, t, c));
                return a.drawingMethod = "drawLines", a
            }
            return a(e, t), e
        }(l.default);
    e.default = h
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        a = n(41),
        s = r(a),
        u = n(43),
        l = r(u),
        c = function() {
            function t(e, n, r) {
                i(this, t), this.gl = e, this.vertices = new Float32Array(n), r && (this.indices = new Uint16Array(r)), this.drawingBuffer = null, this.drawingMethod = "drawTriangles", this.allocate()
            }
            return o(t, [{
                key: "allocate",
                value: function() {
                    var t = this.gl;
                    this.buffer = new s.default(t), this.buffer.data(this.vertices), this.drawingBuffer = this.buffer, this.indices && (this.ibuffer = new l.default(t, t.UNSIGNED_SHORT), this.ibuffer.data(this.indices), this.drawingBuffer = this.ibuffer)
                }
            }, {
                key: "bind",
                value: function(t) {
                    this.gl;
                    this.buffer.attribPointer(t), this.indices && this.ibuffer.bind()
                }
            }, {
                key: "attrib",
                value: function(t, e, n) {
                    this.buffer.attrib(t, e, n)
                }
            }, {
                key: "render",
                value: function() {
                    this.drawingBuffer[this.drawingMethod]()
                }
            }]), t
        }();
    e.default = c
}, function(t, e, n) {
    function r(t, e, n) {
        this.gl = t, this.usage = n || t.STATIC_DRAW, this.buffer = t.createBuffer(), this.attribs = [], this.stride = 0, this.byteLength = 0, this.length = 0, e && this.data(e)
    }
    var i = n(42),
        o = 34962;
    r.prototype = {
        bind: function() {
            this.gl.bindBuffer(o, this.buffer)
        },
        attrib: function(t, e, n, r) {
            return this.attribs.push({
                name: t,
                type: 0 | n,
                size: 0 | e,
                normalize: !!r,
                offset: this.stride
            }), this.stride += i.getComponentSize(n) * e, this._computeLength(), this
        },
        data: function(t) {
            var e = this.gl;
            e.bindBuffer(o, this.buffer), e.bufferData(o, t, this.usage), e.bindBuffer(o, null), this.byteLength = void 0 === t.byteLength ? t : t.byteLength, this._computeLength()
        },
        subData: function(t, e) {
            var n = this.gl;
            n.bindBuffer(o, this.buffer), n.bufferSubData(o, e, t), n.bindBuffer(o, null)
        },
        attribPointer: function(t) {
            var e = this.gl;
            e.bindBuffer(o, this.buffer);
            for (var n = 0; n < this.attribs.length; n++) {
                var r = this.attribs[n];
                if (void 0 !== t[r.name]) {
                    var i = t[r.name]();
                    e.enableVertexAttribArray(i), e.vertexAttribPointer(i, r.size, r.type, r.normalize, this.stride, r.offset)
                }
            }
        },
        draw: function(t, e, n) {
            e = void 0 === e ? this.length : e, this.gl.drawArrays(t, n, 0 | e)
        },
        dispose: function() {
            this.gl.deleteBuffer(this.buffer), this.buffer = null, this.gl = null
        },
        _computeLength: function() {
            this.stride > 0 && (this.length = this.byteLength / this.stride)
        }
    }, i.Drawable(r.prototype), t.exports = r
}, function(t) {
    t.exports = {
        getComponentSize: function(t) {
            switch (t) {
                case 5120:
                case 5121:
                    return 1;
                case 5122:
                case 5123:
                    return 2;
                case 5124:
                case 5125:
                case 5126:
                    return 4;
                default:
                    return 0
            }
        },
        Drawable: function(t) {
            t.drawPoints = function(t, e) {
                this.draw(0, t, e)
            }, t.drawLines = function(t, e) {
                this.draw(1, t, e)
            }, t.drawLineLoop = function(t, e) {
                this.draw(2, t, e)
            }, t.drawLineStrip = function(t, e) {
                this.draw(3, t, e)
            }, t.drawTriangles = function(t, e) {
                this.draw(4, t, e)
            }, t.drawTriangleStrip = function(t, e) {
                this.draw(5, t, e)
            }, t.drawTriangleFan = function(t, e) {
                this.draw(6, t, e)
            }
        }
    }
}, function(t, e, n) {
    function r(t, e, n, r) {
        this.gl = t, this.buffer = t.createBuffer(), this.usage = r || t.STATIC_DRAW, this.type = 0, this.typeSize = 0, this.size = 0, this.setType(e || t.UNSIGNED_SHORT), n && this.data(n)
    }
    var i = n(42),
        o = 34963;
    r.prototype = {
        bind: function() {
            this.gl.bindBuffer(o, this.buffer)
        },
        setType: function(t) {
            this.type = t, this.typeSize = i.getComponentSize(t)
        },
        data: function(t) {
            var e = this.gl;
            e.bindBuffer(o, this.buffer), e.bufferData(o, t, this.usage), e.bindBuffer(o, null), this.size = void 0 === t.byteLength ? t : t.byteLength
        },
        subData: function(t, e) {
            var n = this.gl;
            n.bindBuffer(o, this.buffer), n.bufferSubData(o, e, t), n.bindBuffer(o, null)
        },
        dispose: function() {
            this.gl.deleteBuffer(this.buffer), this.buffer = null, this.gl = null
        },
        draw: function(t, e, n) {
            e = void 0 === e ? this.size / this.typeSize : e, this.gl.drawElements(t, e, this.type, 0 | n)
        }
    }, i.Drawable(r.prototype), t.exports = r
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        a = n(27),
        s = r(a),
        u = n(13),
        l = r(u),
        c = n(41),
        h = r(c),
        f = n(43),
        d = r(f),
        p = n(45),
        _ = r(p),
        m = n(49),
        v = (r(m), s.default.vec3),
        M = s.default.mat4,
        g = v.create(),
        b = v.create(),
        x = v.create(),
        y = M.create(),
        w = function() {
            function t(e, n) {
                i(this, t), this.gl = e, this.opts = n, this.buffer = new h.default(e), this.buffer.attrib("aPosition", 3, e.FLOAT), this.buffer.attrib("aNormal", 3, e.FLOAT), this.buffer.attrib("aBasePosition", 3, e.FLOAT), this.buffer.attrib("aColor", 3, e.FLOAT), this.buffer.attrib("aSpeed", 1, e.FLOAT), this.ibuffer = new d.default(e, e.UNSIGNED_SHORT), this.attribSize = 0;
                for (var r = 0; r < this.buffer.attribs.length; r++) this.attribSize += this.buffer.attribs[r].size;
                this.particlesNumber = 2e3
            }
            return o(t, [{
                key: "make",
                value: function() {
                    var t = new Float32Array(4 * this.particlesNumber * this.attribSize),
                        e = [],
                        n = v.create();
                    n[0] = .2, n[1] = .2, n[2] = .9;
                    for (var r, i, o, a, s, u = v.create(), l = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1], l = [0, 1, 0, .4714, .3333, -.8165, .942809, -.333333, 0, -.9428, .3333, 0, -.471405, -.333333, -.816497, .4714, .3333, .8165, -.471405, -.333333, .816497, 0, -1, 0], c = 0; c < 4 * this.particlesNumber; c += 4) {
                        v.random(g, 7 * Math.random()), v.random(u, .1 * Math.random()), v.add(u, u, n), r = 1 + 2 * Math.random(), i = .1 + Math.random(), o = Math.random() * Math.PI * 2, a = Math.random() * Math.PI * 2, s = Math.random() * Math.PI * 2;
                        for (var h = 0; 4 > h; h++) b[0] = l[6 * h] * i, b[1] = l[6 * h + 1] * i, b[2] = l[6 * h + 2] * i, x[0] = l[6 * h + 3], x[1] = l[6 * h + 4], x[2] = l[6 * h + 5], v.rotateX(b, b, [0, 0, 0], o), v.rotateY(b, b, [0, 0, 0], a), v.rotateZ(b, b, [0, 0, 0], s), v.rotateX(x, x, [0, 0, 0], o), v.rotateY(x, x, [0, 0, 0], a), v.rotateZ(x, x, [0, 0, 0], s), v.add(b, b, g), t.set([b[0], b[1], b[2], x[0], x[1], x[2], g[0], g[1], g[2], u[0], u[1], u[2], r], (c + h) * this.attribSize);
                        e.push(c), e.push(c + 1), e.push(c + 2), e.push(c), e.push(c + 2), e.push(c + 3), e.push(c + 1), e.push(c + 2), e.push(c + 3), e.push(c + 1), e.push(c + 2), e.push(c + 3)
                    }
                    this.buffer.data(t), this.ibuffer.data(new Uint16Array(e))
                }
            }, {
                key: "setup",
                value: function(t) {
                    this.buffer.attribPointer(t), this.ibuffer.bind()
                }
            }, {
                key: "render",
                value: function(t) {
                    this.ibuffer[t]()
                }
            }]), t
        }(),
        S = function() {
            function t(e) {
                i(this, t);
                var n = e.gl;
                this.gl = n, this.scene = e, this._loadables = [], this.root = new l.default, this.prg = e.programs["pyramid-glass"], this.time = 0, this.scale = 4, this.glCfg = n.state.config(), this.glCfg.enableDepthTest(!0).depthMask(!0).enableBlend().blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), this.glCfg2 = n.state.config(), this.glCfg2.enableDepthTest(!0).depthMask(!0), this.glCfg3 = n.state.config(), this.glCfg3.enableDepthTest(!0).depthMask(!0).enableBlend().blendFunc(n.ONE, n.ONE), this.geom = new w(this.gl), this.geom.make(), _.default.add(this, "scale", 0, 10).listen(), document.addEventListener("click", function() {})
            }
            return o(t, [{
                key: "preRender",
                value: function(t) {
                    this.time += t, this.scale = Math.max(this.scale, 0)
                }
            }, {
                key: "render",
                value: function() {
                    if (this.geom) {
                        var t = this.prg,
                            e = this.geom,
                            n = this.scene.camera;
                        t.use(), n.modelViewProjectionMatrix(y, this.root._wmatrix), t.uMVP(y), t.uTime(this.time), t.uScale(this.scale), e.setup(t), this.glCfg.apply(), e.render("drawTriangles"), this.glCfg2.apply(), e.render("drawPoints"), this.glCfg3.apply(), e.render("drawLines")
                    }
                }
            }]), t
        }();
    e.default = S
}, function(t, e, n) {
    "use strict";
    var r = n(46),
        i = !1,
        o = !1,
        a = new r.GUI;
    i && a.domElement.parentNode.removeChild(a.domElement), o && a.close(), t.exports = a
}, function(t, e, n) {
    t.exports = n(47), t.exports.color = n(48)
}, function(t) {
    var e = t.exports = e || {};
    e.gui = e.gui || {}, e.utils = e.utils || {}, e.controllers = e.controllers || {}, e.dom = e.dom || {}, e.color = e.color || {}, e.utils.css = function() {
        return {
            load: function(t, e) {
                e = e || document;
                var n = e.createElement("link");
                n.type = "text/css", n.rel = "stylesheet", n.href = t, e.getElementsByTagName("head")[0].appendChild(n)
            },
            inject: function(t, e) {
                e = e || document;
                var n = document.createElement("style");
                n.type = "text/css", n.innerHTML = t, e.getElementsByTagName("head")[0].appendChild(n)
            }
        }
    }(), e.utils.common = function() {
        var t = Array.prototype.forEach,
            e = Array.prototype.slice;
        return {
            BREAK: {},
            extend: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var n in e) this.isUndefined(e[n]) || (t[n] = e[n])
                }, this), t
            },
            defaults: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var n in e) this.isUndefined(t[n]) && (t[n] = e[n])
                }, this), t
            },
            compose: function() {
                var t = e.call(arguments);
                return function() {
                    for (var n = e.call(arguments), r = t.length - 1; r >= 0; r--) n = [t[r].apply(this, n)];
                    return n[0]
                }
            },
            each: function(e, n, r) {
                if (t && e.forEach === t) e.forEach(n, r);
                else if (e.length === e.length + 0) {
                    for (var i = 0, o = e.length; o > i; i++)
                        if (i in e && n.call(r, e[i], i) === this.BREAK) return
                } else
                    for (var i in e)
                        if (n.call(r, e[i], i) === this.BREAK) return
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            toArray: function(t) {
                return t.toArray ? t.toArray() : e.call(t)
            },
            isUndefined: function(t) {
                return void 0 === t
            },
            isNull: function(t) {
                return null === t
            },
            isNaN: function(t) {
                return t !== t
            },
            isArray: Array.isArray || function(t) {
                return t.constructor === Array
            },
            isObject: function(t) {
                return t === Object(t)
            },
            isNumber: function(t) {
                return t === t + 0
            },
            isString: function(t) {
                return t === t + ""
            },
            isBoolean: function(t) {
                return t === !1 || t === !0
            },
            isFunction: function(t) {
                return "[object Function]" === Object.prototype.toString.call(t)
            }
        }
    }(), e.controllers.Controller = function(t) {
        var e = function(t, e) {
            this.initialValue = t[e], this.domElement = document.createElement("div"), this.object = t, this.property = e, this.__onChange = void 0, this.__onFinishChange = void 0
        };
        return t.extend(e.prototype, {
            onChange: function(t) {
                return this.__onChange = t, this
            },
            onFinishChange: function(t) {
                return this.__onFinishChange = t, this
            },
            setValue: function(t) {
                return this.object[this.property] = t, this.__onChange && this.__onChange.call(this, t), this.updateDisplay(), this
            },
            getValue: function() {
                return this.object[this.property]
            },
            updateDisplay: function() {
                return this
            },
            isModified: function() {
                return this.initialValue !== this.getValue()
            }
        }), e
    }(e.utils.common), e.dom.dom = function(t) {
        function e(e) {
            if ("0" === e || t.isUndefined(e)) return 0;
            var n = e.match(i);
            return t.isNull(n) ? 0 : parseFloat(n[1])
        }
        var n = {
                HTMLEvents: ["change"],
                MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
                KeyboardEvents: ["keydown"]
            },
            r = {};
        t.each(n, function(e, n) {
            t.each(e, function(t) {
                r[t] = n
            })
        });
        var i = /(\d+(\.\d+)?)px/,
            o = {
                makeSelectable: function(t, e) {
                    void 0 !== t && void 0 !== t.style && (t.onselectstart = e ? function() {
                        return !1
                    } : function() {}, t.style.MozUserSelect = e ? "auto" : "none", t.style.KhtmlUserSelect = e ? "auto" : "none", t.unselectable = e ? "on" : "off")
                },
                makeFullscreen: function(e, n, r) {
                    t.isUndefined(n) && (n = !0), t.isUndefined(r) && (r = !0), e.style.position = "absolute", n && (e.style.left = 0, e.style.right = 0), r && (e.style.top = 0, e.style.bottom = 0)
                },
                fakeEvent: function(e, n, i, o) {
                    i = i || {};
                    var a = r[n];
                    if (!a) throw Error("Event type " + n + " not supported.");
                    var s = document.createEvent(a);
                    switch (a) {
                        case "MouseEvents":
                            var u = i.x || i.clientX || 0,
                                l = i.y || i.clientY || 0;
                            s.initMouseEvent(n, i.bubbles || !1, i.cancelable || !0, window, i.clickCount || 1, 0, 0, u, l, !1, !1, !1, !1, 0, null);
                            break;
                        case "KeyboardEvents":
                            var c = s.initKeyboardEvent || s.initKeyEvent;
                            t.defaults(i, {
                                cancelable: !0,
                                ctrlKey: !1,
                                altKey: !1,
                                shiftKey: !1,
                                metaKey: !1,
                                keyCode: void 0,
                                charCode: void 0
                            }), c(n, i.bubbles || !1, i.cancelable, window, i.ctrlKey, i.altKey, i.shiftKey, i.metaKey, i.keyCode, i.charCode);
                            break;
                        default:
                            s.initEvent(n, i.bubbles || !1, i.cancelable || !0)
                    }
                    t.defaults(s, o), e.dispatchEvent(s)
                },
                bind: function(t, e, n, r) {
                    return r = r || !1, t.addEventListener ? t.addEventListener(e, n, r) : t.attachEvent && t.attachEvent("on" + e, n), o
                },
                unbind: function(t, e, n, r) {
                    return r = r || !1, t.removeEventListener ? t.removeEventListener(e, n, r) : t.detachEvent && t.detachEvent("on" + e, n), o
                },
                addClass: function(t, e) {
                    if (void 0 === t.className) t.className = e;
                    else if (t.className !== e) {
                        var n = t.className.split(/ +/); - 1 == n.indexOf(e) && (n.push(e), t.className = n.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                    }
                    return o
                },
                removeClass: function(t, e) {
                    if (e)
                        if (void 0 === t.className);
                        else if (t.className === e) t.removeAttribute("class");
                    else {
                        var n = t.className.split(/ +/),
                            r = n.indexOf(e); - 1 != r && (n.splice(r, 1), t.className = n.join(" "))
                    } else t.className = void 0;
                    return o
                },
                hasClass: function(t, e) {
                    return RegExp("(?:^|\\s+)" + e + "(?:\\s+|$)").test(t.className) || !1
                },
                getWidth: function(t) {
                    var n = getComputedStyle(t);
                    return e(n["border-left-width"]) + e(n["border-right-width"]) + e(n["padding-left"]) + e(n["padding-right"]) + e(n.width)
                },
                getHeight: function(t) {
                    var n = getComputedStyle(t);
                    return e(n["border-top-width"]) + e(n["border-bottom-width"]) + e(n["padding-top"]) + e(n["padding-bottom"]) + e(n.height)
                },
                getOffset: function(t) {
                    var e = {
                        left: 0,
                        top: 0
                    };
                    if (t.offsetParent)
                        do e.left += t.offsetLeft, e.top += t.offsetTop; while (t = t.offsetParent);
                    return e
                },
                isActive: function(t) {
                    return t === document.activeElement && (t.type || t.href)
                }
            };
        return o
    }(e.utils.common), e.controllers.OptionController = function(t, e, n) {
        var r = function(t, i, o) {
            r.superclass.call(this, t, i);
            var a = this;
            if (this.__select = document.createElement("select"), n.isArray(o)) {
                var s = {};
                n.each(o, function(t) {
                    s[t] = t
                }), o = s
            }
            n.each(o, function(t, e) {
                var n = document.createElement("option");
                n.innerHTML = e, n.setAttribute("value", t), a.__select.appendChild(n)
            }), this.updateDisplay(), e.bind(this.__select, "change", function() {
                var t = this.options[this.selectedIndex].value;
                a.setValue(t)
            }), this.domElement.appendChild(this.__select)
        };
        return r.superclass = t, n.extend(r.prototype, t.prototype, {
            setValue: function(t) {
                var e = r.superclass.prototype.setValue.call(this, t);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), e
            },
            updateDisplay: function() {
                return this.__select.value = this.getValue(), r.superclass.prototype.updateDisplay.call(this)
            }
        }), r
    }(e.controllers.Controller, e.dom.dom, e.utils.common), e.controllers.NumberController = function(t, e) {
        function n(t) {
            return t = "" + t, t.indexOf(".") > -1 ? t.length - t.indexOf(".") - 1 : 0
        }
        var r = function(t, i, o) {
            r.superclass.call(this, t, i), o = o || {}, this.__min = o.min, this.__max = o.max, this.__step = o.step, this.__impliedStep = e.isUndefined(this.__step) ? 0 == this.initialValue ? 1 : Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__step, this.__precision = n(this.__impliedStep)
        };
        return r.superclass = t, e.extend(r.prototype, t.prototype, {
            setValue: function(t) {
                return void 0 !== this.__min && t < this.__min ? t = this.__min : void 0 !== this.__max && t > this.__max && (t = this.__max), void 0 !== this.__step && t % this.__step != 0 && (t = Math.round(t / this.__step) * this.__step), r.superclass.prototype.setValue.call(this, t)
            },
            min: function(t) {
                return this.__min = t, this
            },
            max: function(t) {
                return this.__max = t, this
            },
            step: function(t) {
                return this.__step = t, this
            }
        }), r
    }(e.controllers.Controller, e.utils.common), e.controllers.NumberControllerBox = function(t, e, n) {
        function r(t, e) {
            var n = Math.pow(10, e);
            return Math.round(t * n) / n
        }
        var i = function(t, r, o) {
            function a() {
                var t = parseFloat(f.__input.value);
                n.isNaN(t) || f.setValue(t)
            }

            function s() {
                a(), f.__onFinishChange && f.__onFinishChange.call(f, f.getValue())
            }

            function u(t) {
                e.bind(window, "mousemove", l), e.bind(window, "mouseup", c), h = t.clientY
            }

            function l(t) {
                var e = h - t.clientY;
                f.setValue(f.getValue() + e * f.__impliedStep), h = t.clientY
            }

            function c() {
                e.unbind(window, "mousemove", l), e.unbind(window, "mouseup", c)
            }
            this.__truncationSuspended = !1, i.superclass.call(this, t, r, o);
            var h, f = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "change", a), e.bind(this.__input, "blur", s), e.bind(this.__input, "mousedown", u), e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && (f.__truncationSuspended = !0, this.blur(), f.__truncationSuspended = !1)
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return i.superclass = t, n.extend(i.prototype, t.prototype, {
            updateDisplay: function() {
                return this.__input.value = this.__truncationSuspended ? this.getValue() : r(this.getValue(), this.__precision), i.superclass.prototype.updateDisplay.call(this)
            }
        }), i
    }(e.controllers.NumberController, e.dom.dom, e.utils.common), e.controllers.NumberControllerSlider = function(t, e, n, r, i) {
        function o(t, e, n, r, i) {
            return r + (i - r) * ((t - e) / (n - e))
        }
        var a = function(t, n, r, i, s) {
            function u(t) {
                e.bind(window, "mousemove", l), e.bind(window, "mouseup", c), l(t)
            }

            function l(t) {
                t.preventDefault();
                var n = e.getOffset(h.__background),
                    r = e.getWidth(h.__background);
                return h.setValue(o(t.clientX, n.left, n.left + r, h.__min, h.__max)), !1
            }

            function c() {
                e.unbind(window, "mousemove", l), e.unbind(window, "mouseup", c), h.__onFinishChange && h.__onFinishChange.call(h, h.getValue())
            }
            a.superclass.call(this, t, n, {
                min: r,
                max: i,
                step: s
            });
            var h = this;
            this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), e.bind(this.__background, "mousedown", u), e.addClass(this.__background, "slider"), e.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background)
        };
        return a.superclass = t, a.useDefaultStyles = function() {
            n.inject(i)
        }, r.extend(a.prototype, t.prototype, {
            updateDisplay: function() {
                var t = (this.getValue() - this.__min) / (this.__max - this.__min);
                return this.__foreground.style.width = 100 * t + "%", a.superclass.prototype.updateDisplay.call(this)
            }
        }), a
    }(e.controllers.NumberController, e.dom.dom, e.utils.css, e.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}"), e.controllers.FunctionController = function(t, e, n) {
        var r = function(t, n, i) {
            r.superclass.call(this, t, n);
            var o = this;
            this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === i ? "Fire" : i, e.bind(this.__button, "click", function(t) {
                return t.preventDefault(), o.fire(), !1
            }), e.addClass(this.__button, "button"), this.domElement.appendChild(this.__button)
        };
        return r.superclass = t, n.extend(r.prototype, t.prototype, {
            fire: function() {
                this.__onChange && this.__onChange.call(this), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.getValue().call(this.object)
            }
        }), r
    }(e.controllers.Controller, e.dom.dom, e.utils.common), e.controllers.BooleanController = function(t, e, n) {
        var r = function(t, n) {
            function i() {
                o.setValue(!o.__prev)
            }
            r.superclass.call(this, t, n);
            var o = this;
            this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), e.bind(this.__checkbox, "change", i, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay()
        };
        return r.superclass = t, n.extend(r.prototype, t.prototype, {
            setValue: function(t) {
                var e = r.superclass.prototype.setValue.call(this, t);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), e
            },
            updateDisplay: function() {
                return this.getValue() === !0 ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1, r.superclass.prototype.updateDisplay.call(this)
            }
        }), r
    }(e.controllers.Controller, e.dom.dom, e.utils.common), e.color.toString = function(t) {
        return function(e) {
            if (1 == e.a || t.isUndefined(e.a)) {
                for (var n = e.hex.toString(16); n.length < 6;) n = "0" + n;
                return "#" + n
            }
            return "rgba(" + Math.round(e.r) + "," + Math.round(e.g) + "," + Math.round(e.b) + "," + e.a + ")"
        }
    }(e.utils.common), e.color.interpret = function(t, e) {
        var n, r, i = function() {
                r = !1;
                var t = arguments.length > 1 ? e.toArray(arguments) : arguments[0];
                return e.each(o, function(i) {
                    return i.litmus(t) ? (e.each(i.conversions, function(i, o) {
                        return n = i.read(t), r === !1 && n !== !1 ? (r = n, n.conversionName = o, n.conversion = i, e.BREAK) : void 0
                    }), e.BREAK) : void 0
                }), r
            },
            o = [{
                litmus: e.isString,
                conversions: {
                    THREE_CHAR_HEX: {
                        read: function(t) {
                            var e = t.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                            return null === e ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + e[1] + ("" + e[1]) + ("" + e[2]) + ("" + e[2]) + ("" + e[3]) + ("" + e[3]))
                            }
                        },
                        write: t
                    },
                    SIX_CHAR_HEX: {
                        read: function(t) {
                            var e = t.match(/^#([A-F0-9]{6})$/i);
                            return null === e ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + e[1])
                            }
                        },
                        write: t
                    },
                    CSS_RGB: {
                        read: function(t) {
                            var e = t.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                            return null === e ? !1 : {
                                space: "RGB",
                                r: parseFloat(e[1]),
                                g: parseFloat(e[2]),
                                b: parseFloat(e[3])
                            }
                        },
                        write: t
                    },
                    CSS_RGBA: {
                        read: function(t) {
                            var e = t.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                            return null === e ? !1 : {
                                space: "RGB",
                                r: parseFloat(e[1]),
                                g: parseFloat(e[2]),
                                b: parseFloat(e[3]),
                                a: parseFloat(e[4])
                            }
                        },
                        write: t
                    }
                }
            }, {
                litmus: e.isNumber,
                conversions: {
                    HEX: {
                        read: function(t) {
                            return {
                                space: "HEX",
                                hex: t,
                                conversionName: "HEX"
                            }
                        },
                        write: function(t) {
                            return t.hex
                        }
                    }
                }
            }, {
                litmus: e.isArray,
                conversions: {
                    RGB_ARRAY: {
                        read: function(t) {
                            return 3 != t.length ? !1 : {
                                space: "RGB",
                                r: t[0],
                                g: t[1],
                                b: t[2]
                            }
                        },
                        write: function(t) {
                            return [t.r, t.g, t.b]
                        }
                    },
                    RGBA_ARRAY: {
                        read: function(t) {
                            return 4 != t.length ? !1 : {
                                space: "RGB",
                                r: t[0],
                                g: t[1],
                                b: t[2],
                                a: t[3]
                            }
                        },
                        write: function(t) {
                            return [t.r, t.g, t.b, t.a]
                        }
                    }
                }
            }, {
                litmus: e.isObject,
                conversions: {
                    RGBA_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) && e.isNumber(t.a) ? {
                                space: "RGB",
                                r: t.r,
                                g: t.g,
                                b: t.b,
                                a: t.a
                            } : !1
                        },
                        write: function(t) {
                            return {
                                r: t.r,
                                g: t.g,
                                b: t.b,
                                a: t.a
                            }
                        }
                    },
                    RGB_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) ? {
                                space: "RGB",
                                r: t.r,
                                g: t.g,
                                b: t.b
                            } : !1
                        },
                        write: function(t) {
                            return {
                                r: t.r,
                                g: t.g,
                                b: t.b
                            }
                        }
                    },
                    HSVA_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) && e.isNumber(t.a) ? {
                                space: "HSV",
                                h: t.h,
                                s: t.s,
                                v: t.v,
                                a: t.a
                            } : !1
                        },
                        write: function(t) {
                            return {
                                h: t.h,
                                s: t.s,
                                v: t.v,
                                a: t.a
                            }
                        }
                    },
                    HSV_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) ? {
                                space: "HSV",
                                h: t.h,
                                s: t.s,
                                v: t.v
                            } : !1
                        },
                        write: function(t) {
                            return {
                                h: t.h,
                                s: t.s,
                                v: t.v
                            }
                        }
                    }
                }
            }];
        return i
    }(e.color.toString, e.utils.common), e.GUI = e.gui.GUI = function(t, e, n, r, i, o, a, s, u, l, c, h, f, d, p) {
        function _(t, e, n, o) {
            if (void 0 === e[n]) throw Error("Object " + e + ' has no property "' + n + '"');
            var a;
            if (o.color) a = new c(e, n);
            else {
                var s = [e, n].concat(o.factoryArgs);
                a = r.apply(t, s)
            }
            o.before instanceof i && (o.before = o.before.__li), M(t, a), d.addClass(a.domElement, "c");
            var u = document.createElement("span");
            d.addClass(u, "property-name"), u.innerHTML = a.property;
            var l = document.createElement("div");
            l.appendChild(u), l.appendChild(a.domElement);
            var h = m(t, l, o.before);
            return d.addClass(h, N.CLASS_CONTROLLER_ROW), d.addClass(h, typeof a.getValue()), v(t, h, a), t.__controllers.push(a), a
        }

        function m(t, e, n) {
            var r = document.createElement("li");
            return e && r.appendChild(e), n ? t.__ul.insertBefore(r, params.before) : t.__ul.appendChild(r), t.onResize(), r
        }

        function v(t, e, n) {
            if (n.__li = e, n.__gui = t, p.extend(n, {
                    options: function(e) {
                        return arguments.length > 1 ? (n.remove(), _(t, n.object, n.property, {
                            before: n.__li.nextElementSibling,
                            factoryArgs: [p.toArray(arguments)]
                        })) : p.isArray(e) || p.isObject(e) ? (n.remove(), _(t, n.object, n.property, {
                            before: n.__li.nextElementSibling,
                            factoryArgs: [e]
                        })) : void 0
                    },
                    name: function(t) {
                        return n.__li.firstElementChild.firstElementChild.innerHTML = t, n
                    },
                    listen: function() {
                        return n.__gui.listen(n), n
                    },
                    remove: function() {
                        return n.__gui.remove(n), n
                    }
                }), n instanceof u) {
                var r = new s(n.object, n.property, {
                    min: n.__min,
                    max: n.__max,
                    step: n.__step
                });
                p.each(["updateDisplay", "onChange", "onFinishChange"], function(t) {
                    var e = n[t],
                        i = r[t];
                    n[t] = r[t] = function() {
                        var t = Array.prototype.slice.call(arguments);
                        return e.apply(n, t), i.apply(r, t)
                    }
                }), d.addClass(e, "has-slider"), n.domElement.insertBefore(r.domElement, n.domElement.firstElementChild)
            } else if (n instanceof s) {
                var i = function(e) {
                    return p.isNumber(n.__min) && p.isNumber(n.__max) ? (n.remove(), _(t, n.object, n.property, {
                        before: n.__li.nextElementSibling,
                        factoryArgs: [n.__min, n.__max, n.__step]
                    })) : e
                };
                n.min = p.compose(i, n.min), n.max = p.compose(i, n.max)
            } else n instanceof o ? (d.bind(e, "click", function() {
                d.fakeEvent(n.__checkbox, "click")
            }), d.bind(n.__checkbox, "click", function(t) {
                t.stopPropagation()
            })) : n instanceof a ? (d.bind(e, "click", function() {
                d.fakeEvent(n.__button, "click")
            }), d.bind(e, "mouseover", function() {
                d.addClass(n.__button, "hover")
            }), d.bind(e, "mouseout", function() {
                d.removeClass(n.__button, "hover")
            })) : n instanceof c && (d.addClass(e, "color"), n.updateDisplay = p.compose(function(t) {
                return e.style.borderLeftColor = "" + n.__color, t
            }, n.updateDisplay), n.updateDisplay());
            n.setValue = p.compose(function(e) {
                return t.getRoot().__preset_select && n.isModified() && E(t.getRoot(), !0), e
            }, n.setValue)
        }

        function M(t, e) {
            var n = t.getRoot(),
                r = n.__rememberedObjects.indexOf(e.object);
            if (-1 != r) {
                var i = n.__rememberedObjectIndecesToControllers[r];
                if (void 0 === i && (i = {}, n.__rememberedObjectIndecesToControllers[r] = i), i[e.property] = e, n.load && n.load.remembered) {
                    var o, a = n.load.remembered;
                    if (a[t.preset]) o = a[t.preset];
                    else {
                        if (!a[R]) return;
                        o = a[R]
                    }
                    if (o[r] && void 0 !== o[r][e.property]) {
                        var s = o[r][e.property];
                        e.initialValue = s, e.setValue(s)
                    }
                }
            }
        }

        function g(t, e) {
            return document.location.href + "." + e
        }

        function b(t) {
            function e() {
                l.style.display = t.useLocalStorage ? "block" : "none"
            }
            var n = t.__save_row = document.createElement("li");
            d.addClass(t.domElement, "has-save"), t.__ul.insertBefore(n, t.__ul.firstChild), d.addClass(n, "save-row");
            var r = document.createElement("span");
            r.innerHTML = "&nbsp;", d.addClass(r, "button gears");
            var i = document.createElement("span");
            i.innerHTML = "Save", d.addClass(i, "button"), d.addClass(i, "save");
            var o = document.createElement("span");
            o.innerHTML = "New", d.addClass(o, "button"), d.addClass(o, "save-as");
            var a = document.createElement("span");
            a.innerHTML = "Revert", d.addClass(a, "button"), d.addClass(a, "revert");
            var s = t.__preset_select = document.createElement("select");
            if (t.load && t.load.remembered ? p.each(t.load.remembered, function(e, n) {
                    S(t, n, n == t.preset)
                }) : S(t, R, !1), d.bind(s, "change", function() {
                    for (var e = 0; e < t.__preset_select.length; e++) t.__preset_select[e].innerHTML = t.__preset_select[e].value;
                    t.preset = this.value
                }), n.appendChild(s), n.appendChild(r), n.appendChild(i), n.appendChild(o), n.appendChild(a), O) {
                var u = document.getElementById("dg-save-locally"),
                    l = document.getElementById("dg-local-explain");
                u.style.display = "block";
                var c = document.getElementById("dg-local-storage");
                "true" === localStorage.getItem(g(t, "isLocal")) && c.setAttribute("checked", "checked"), e(), d.bind(c, "change", function() {
                    t.useLocalStorage = !t.useLocalStorage, e()
                })
            }
            var h = document.getElementById("dg-new-constructor");
            d.bind(h, "keydown", function(t) {
                !t.metaKey || 67 !== t.which && 67 != t.keyCode || A.hide()
            }), d.bind(r, "click", function() {
                h.innerHTML = JSON.stringify(t.getSaveObject(), void 0, 2), A.show(), h.focus(), h.select()
            }), d.bind(i, "click", function() {
                t.save()
            }), d.bind(o, "click", function() {
                var e = prompt("Enter a new preset name.");
                e && t.saveAs(e)
            }), d.bind(a, "click", function() {
                t.revert()
            })
        }

        function x(t) {
            function e(e) {
                return e.preventDefault(), i = e.clientX, d.addClass(t.__closeButton, N.CLASS_DRAG), d.bind(window, "mousemove", n), d.bind(window, "mouseup", r), !1
            }

            function n(e) {
                return e.preventDefault(), t.width += i - e.clientX, t.onResize(), i = e.clientX, !1
            }

            function r() {
                d.removeClass(t.__closeButton, N.CLASS_DRAG), d.unbind(window, "mousemove", n), d.unbind(window, "mouseup", r)
            }
            t.__resize_handle = document.createElement("div"), p.extend(t.__resize_handle.style, {
                width: "6px",
                marginLeft: "-3px",
                height: "200px",
                cursor: "ew-resize",
                position: "absolute"
            });
            var i;
            d.bind(t.__resize_handle, "mousedown", e), d.bind(t.__closeButton, "mousedown", e), t.domElement.insertBefore(t.__resize_handle, t.domElement.firstElementChild)
        }

        function y(t, e) {
            t.domElement.style.width = e + "px", t.__save_row && t.autoPlace && (t.__save_row.style.width = e + "px"), t.__closeButton && (t.__closeButton.style.width = e + "px")
        }

        function w(t, e) {
            var n = {};
            return p.each(t.__rememberedObjects, function(r, i) {
                var o = {},
                    a = t.__rememberedObjectIndecesToControllers[i];
                p.each(a, function(t, n) {
                    o[n] = e ? t.initialValue : t.getValue()
                }), n[i] = o
            }), n
        }

        function S(t, e, n) {
            var r = document.createElement("option");
            r.innerHTML = e, r.value = e, t.__preset_select.appendChild(r), n && (t.__preset_select.selectedIndex = t.__preset_select.length - 1)
        }

        function I(t) {
            for (var e = 0; e < t.__preset_select.length; e++) t.__preset_select[e].value == t.preset && (t.__preset_select.selectedIndex = e)
        }

        function E(t, e) {
            var n = t.__preset_select[t.__preset_select.selectedIndex];
            n.innerHTML = e ? n.value + "*" : n.value
        }

        function D(t) {
            0 != t.length && h(function() {
                D(t)
            }), p.each(t, function(t) {
                t.updateDisplay()
            })
        }
        t.inject(n);
        var A, F, P = "dg",
            C = 72,
            T = 20,
            R = "Default",
            O = function() {
                try {
                    return "localStorage" in window && null !== window.localStorage
                } catch (t) {
                    return !1
                }
            }(),
            L = !0,
            z = !1,
            k = [],
            N = function(t) {
                function e() {
                    localStorage.setItem(g(r, "gui"), JSON.stringify(r.getSaveObject()))
                }

                function n() {
                    var t = r.getRoot();
                    t.width += 1, p.defer(function() {
                        t.width -= 1
                    })
                }
                var r = this;
                this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), d.addClass(this.domElement, P), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], t = t || {}, t = p.defaults(t, {
                    autoPlace: !0,
                    width: N.DEFAULT_WIDTH
                }), t = p.defaults(t, {
                    resizable: t.autoPlace,
                    hideable: t.autoPlace
                }), p.isUndefined(t.load) ? t.load = {
                    preset: R
                } : t.preset && (t.load.preset = t.preset), p.isUndefined(t.parent) && t.hideable && k.push(this), t.resizable = p.isUndefined(t.parent) && t.resizable, t.autoPlace && p.isUndefined(t.scrollable) && (t.scrollable = !0);
                var i = O && "true" === localStorage.getItem(g(this, "isLocal"));
                if (Object.defineProperties(this, {
                        parent: {
                            get: function() {
                                return t.parent
                            }
                        },
                        scrollable: {
                            get: function() {
                                return t.scrollable
                            }
                        },
                        autoPlace: {
                            get: function() {
                                return t.autoPlace
                            }
                        },
                        preset: {
                            get: function() {
                                return r.parent ? r.getRoot().preset : t.load.preset
                            },
                            set: function(e) {
                                r.parent ? r.getRoot().preset = e : t.load.preset = e, I(this), r.revert()
                            }
                        },
                        width: {
                            get: function() {
                                return t.width
                            },
                            set: function(e) {
                                t.width = e, y(r, e)
                            }
                        },
                        name: {
                            get: function() {
                                return t.name
                            },
                            set: function(e) {
                                t.name = e, a && (a.innerHTML = t.name)
                            }
                        },
                        closed: {
                            get: function() {
                                return t.closed
                            },
                            set: function(e) {
                                t.closed = e, t.closed ? d.addClass(r.__ul, N.CLASS_CLOSED) : d.removeClass(r.__ul, N.CLASS_CLOSED), this.onResize(), r.__closeButton && (r.__closeButton.innerHTML = e ? N.TEXT_OPEN : N.TEXT_CLOSED)
                            }
                        },
                        load: {
                            get: function() {
                                return t.load
                            }
                        },
                        useLocalStorage: {
                            get: function() {
                                return i
                            },
                            set: function(t) {
                                O && (i = t, t ? d.bind(window, "unload", e) : d.unbind(window, "unload", e), localStorage.setItem(g(r, "isLocal"), t))
                            }
                        }
                    }), p.isUndefined(t.parent)) {
                    if (t.closed = !1, d.addClass(this.domElement, N.CLASS_MAIN), d.makeSelectable(this.domElement, !1), O && i) {
                        r.useLocalStorage = !0;
                        var o = localStorage.getItem(g(this, "gui"));
                        o && (t.load = JSON.parse(o))
                    }
                    this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = N.TEXT_CLOSED, d.addClass(this.__closeButton, N.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), d.bind(this.__closeButton, "click", function() {
                        r.closed = !r.closed
                    })
                } else {
                    void 0 === t.closed && (t.closed = !0);
                    var a = document.createTextNode(t.name);
                    d.addClass(a, "controller-name");
                    var s = m(r, a),
                        u = function(t) {
                            return t.preventDefault(), r.closed = !r.closed, !1
                        };
                    d.addClass(this.__ul, N.CLASS_CLOSED), d.addClass(s, "title"), d.bind(s, "click", u), t.closed || (this.closed = !1)
                }
                t.autoPlace && (p.isUndefined(t.parent) && (L && (F = document.createElement("div"), d.addClass(F, P), d.addClass(F, N.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(F), L = !1), F.appendChild(this.domElement), d.addClass(this.domElement, N.CLASS_AUTO_PLACE)), this.parent || y(r, t.width)), d.bind(window, "resize", function() {
                    r.onResize()
                }), d.bind(this.__ul, "webkitTransitionEnd", function() {
                    r.onResize()
                }), d.bind(this.__ul, "transitionend", function() {
                    r.onResize()
                }), d.bind(this.__ul, "oTransitionEnd", function() {
                    r.onResize()
                }), this.onResize(), t.resizable && x(this);
                r.getRoot();
                t.parent || n()
            };
        return N.toggleHide = function() {
            z = !z, p.each(k, function(t) {
                t.domElement.style.zIndex = z ? -999 : 999, t.domElement.style.opacity = z ? 0 : 1
            })
        }, N.CLASS_AUTO_PLACE = "a", N.CLASS_AUTO_PLACE_CONTAINER = "ac", N.CLASS_MAIN = "main", N.CLASS_CONTROLLER_ROW = "cr", N.CLASS_TOO_TALL = "taller-than-window", N.CLASS_CLOSED = "closed", N.CLASS_CLOSE_BUTTON = "close-button", N.CLASS_DRAG = "drag", N.DEFAULT_WIDTH = 245, N.TEXT_CLOSED = "Close Controls", N.TEXT_OPEN = "Open Controls", d.bind(window, "keydown", function(t) {
            "text" === document.activeElement.type || t.which !== C && t.keyCode != C || N.toggleHide()
        }, !1), p.extend(N.prototype, {
            add: function(t, e) {
                return _(this, t, e, {
                    factoryArgs: Array.prototype.slice.call(arguments, 2)
                })
            },
            addColor: function(t, e) {
                return _(this, t, e, {
                    color: !0
                })
            },
            remove: function(t) {
                this.__ul.removeChild(t.__li), this.__controllers.slice(this.__controllers.indexOf(t), 1);
                var e = this;
                p.defer(function() {
                    e.onResize()
                })
            },
            destroy: function() {
                this.autoPlace && F.removeChild(this.domElement)
            },
            addFolder: function(t) {
                if (void 0 !== this.__folders[t]) throw Error('You already have a folder in this GUI by the name "' + t + '"');
                var e = {
                    name: t,
                    parent: this
                };
                e.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[t] && (e.closed = this.load.folders[t].closed, e.load = this.load.folders[t]);
                var n = new N(e);
                this.__folders[t] = n;
                var r = m(this, n.domElement);
                return d.addClass(r, "folder"), n
            },
            open: function() {
                this.closed = !1
            },
            close: function() {
                this.closed = !0
            },
            onResize: function() {
                var t = this.getRoot();
                if (t.scrollable) {
                    var e = d.getOffset(t.__ul).top,
                        n = 0;
                    p.each(t.__ul.childNodes, function(e) {
                        t.autoPlace && e === t.__save_row || (n += d.getHeight(e))
                    }), window.innerHeight - e - T < n ? (d.addClass(t.domElement, N.CLASS_TOO_TALL), t.__ul.style.height = window.innerHeight - e - T + "px") : (d.removeClass(t.domElement, N.CLASS_TOO_TALL), t.__ul.style.height = "auto")
                }
                t.__resize_handle && p.defer(function() {
                    t.__resize_handle.style.height = t.__ul.offsetHeight + "px"
                }), t.__closeButton && (t.__closeButton.style.width = t.width + "px")
            },
            remember: function() {
                if (p.isUndefined(A) && (A = new f, A.domElement.innerHTML = e), this.parent) throw Error("You can only call remember on a top level GUI.");
                var t = this;
                p.each(Array.prototype.slice.call(arguments), function(e) {
                    0 == t.__rememberedObjects.length && b(t), -1 == t.__rememberedObjects.indexOf(e) && t.__rememberedObjects.push(e)
                }), this.autoPlace && y(this, this.width)
            },
            getRoot: function() {
                for (var t = this; t.parent;) t = t.parent;
                return t
            },
            getSaveObject: function() {
                var t = this.load;
                return t.closed = this.closed, this.__rememberedObjects.length > 0 && (t.preset = this.preset, t.remembered || (t.remembered = {}), t.remembered[this.preset] = w(this)), t.folders = {}, p.each(this.__folders, function(e, n) {
                    t.folders[n] = e.getSaveObject()
                }), t
            },
            save: function() {
                this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = w(this), E(this, !1)
            },
            saveAs: function(t) {
                this.load.remembered || (this.load.remembered = {}, this.load.remembered[R] = w(this, !0)), this.load.remembered[t] = w(this), this.preset = t, S(this, t, !0)
            },
            revert: function(t) {
                p.each(this.__controllers, function(e) {
                    this.getRoot().load.remembered ? M(t || this.getRoot(), e) : e.setValue(e.initialValue)
                }, this), p.each(this.__folders, function(t) {
                    t.revert(t)
                }), t || E(this.getRoot(), !1)
            },
            listen: function(t) {
                var e = 0 == this.__listening.length;
                this.__listening.push(t), e && D(this.__listening)
            }
        }), N
    }(e.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", e.controllers.factory = function(t, e, n, r, i, o, a) {
        return function(s, u) {
            var l = s[u];
            return a.isArray(arguments[2]) || a.isObject(arguments[2]) ? new t(s, u, arguments[2]) : a.isNumber(l) ? a.isNumber(arguments[2]) && a.isNumber(arguments[3]) ? new n(s, u, arguments[2], arguments[3]) : new e(s, u, {
                min: arguments[2],
                max: arguments[3]
            }) : a.isString(l) ? new r(s, u) : a.isFunction(l) ? new i(s, u, "") : a.isBoolean(l) ? new o(s, u) : void 0
        }
    }(e.controllers.OptionController, e.controllers.NumberControllerBox, e.controllers.NumberControllerSlider, e.controllers.StringController = function(t, e, n) {
        var r = function(t, n) {
            function i() {
                a.setValue(a.__input.value)
            }

            function o() {
                a.__onFinishChange && a.__onFinishChange.call(a, a.getValue())
            }
            r.superclass.call(this, t, n);
            var a = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "keyup", i), e.bind(this.__input, "change", i), e.bind(this.__input, "blur", o), e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && this.blur()
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return r.superclass = t, n.extend(r.prototype, t.prototype, {
            updateDisplay: function() {
                return e.isActive(this.__input) || (this.__input.value = this.getValue()), r.superclass.prototype.updateDisplay.call(this)
            }
        }), r
    }(e.controllers.Controller, e.dom.dom, e.utils.common), e.controllers.FunctionController, e.controllers.BooleanController, e.utils.common), e.controllers.Controller, e.controllers.BooleanController, e.controllers.FunctionController, e.controllers.NumberControllerBox, e.controllers.NumberControllerSlider, e.controllers.OptionController, e.controllers.ColorController = function(t, e, n, r, i) {
        function o(t, e, n, r) {
            t.style.background = "", i.each(u, function(i) {
                t.style.cssText += "background: " + i + "linear-gradient(" + e + ", " + n + " 0%, " + r + " 100%); "
            })
        }

        function a(t) {
            t.style.background = "", t.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", t.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
        }
        var s = function(t, u) {
            function l(t) {
                d(t), e.bind(window, "mousemove", d), e.bind(window, "mouseup", c)
            }

            function c() {
                e.unbind(window, "mousemove", d), e.unbind(window, "mouseup", c)
            }

            function h() {
                var t = r(this.value);
                t !== !1 ? (_.__color.__state = t, _.setValue(_.__color.toOriginal())) : this.value = "" + _.__color
            }

            function f() {
                e.unbind(window, "mousemove", p), e.unbind(window, "mouseup", f)
            }

            function d(t) {
                t.preventDefault();
                var n = e.getWidth(_.__saturation_field),
                    r = e.getOffset(_.__saturation_field),
                    i = (t.clientX - r.left + document.body.scrollLeft) / n,
                    o = 1 - (t.clientY - r.top + document.body.scrollTop) / n;
                return o > 1 ? o = 1 : 0 > o && (o = 0), i > 1 ? i = 1 : 0 > i && (i = 0), _.__color.v = o, _.__color.s = i, _.setValue(_.__color.toOriginal()), !1
            }

            function p(t) {
                t.preventDefault();
                var n = e.getHeight(_.__hue_field),
                    r = e.getOffset(_.__hue_field),
                    i = 1 - (t.clientY - r.top + document.body.scrollTop) / n;
                return i > 1 ? i = 1 : 0 > i && (i = 0), _.__color.h = 360 * i, _.setValue(_.__color.toOriginal()), !1
            }
            s.superclass.call(this, t, u), this.__color = new n(this.getValue()), this.__temp = new n(0);
            var _ = this;
            this.domElement = document.createElement("div"), e.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && h.call(this)
            }), e.bind(this.__input, "blur", h), e.bind(this.__selector, "mousedown", function() {
                e.addClass(this, "drag").bind(window, "mouseup", function() {
                    e.removeClass(_.__selector, "drag")
                })
            });
            var m = document.createElement("div");
            i.extend(this.__selector.style, {
                width: "122px",
                height: "102px",
                padding: "3px",
                backgroundColor: "#222",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
            }), i.extend(this.__field_knob.style, {
                position: "absolute",
                width: "12px",
                height: "12px",
                border: this.__field_knob_border + (this.__color.v < .5 ? "#fff" : "#000"),
                boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                borderRadius: "12px",
                zIndex: 1
            }), i.extend(this.__hue_knob.style, {
                position: "absolute",
                width: "15px",
                height: "2px",
                borderRight: "4px solid #fff",
                zIndex: 1
            }), i.extend(this.__saturation_field.style, {
                width: "100px",
                height: "100px",
                border: "1px solid #555",
                marginRight: "3px",
                display: "inline-block",
                cursor: "pointer"
            }), i.extend(m.style, {
                width: "100%",
                height: "100%",
                background: "none"
            }), o(m, "top", "rgba(0,0,0,0)", "#000"), i.extend(this.__hue_field.style, {
                width: "15px",
                height: "100px",
                display: "inline-block",
                border: "1px solid #555",
                cursor: "ns-resize"
            }), a(this.__hue_field), i.extend(this.__input.style, {
                outline: "none",
                textAlign: "center",
                color: "#fff",
                border: 0,
                fontWeight: "bold",
                textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
            }), e.bind(this.__saturation_field, "mousedown", l), e.bind(this.__field_knob, "mousedown", l), e.bind(this.__hue_field, "mousedown", function(t) {
                p(t), e.bind(window, "mousemove", p), e.bind(window, "mouseup", f)
            }), this.__saturation_field.appendChild(m), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay()
        };
        s.superclass = t, i.extend(s.prototype, t.prototype, {
            updateDisplay: function() {
                var t = r(this.getValue());
                if (t !== !1) {
                    var e = !1;
                    i.each(n.COMPONENTS, function(n) {
                        return i.isUndefined(t[n]) || i.isUndefined(this.__color.__state[n]) || t[n] === this.__color.__state[n] ? void 0 : (e = !0, {})
                    }, this), e && i.extend(this.__color.__state, t)
                }
                i.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                var a = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                    s = 255 - a;
                i.extend(this.__field_knob.style, {
                    marginLeft: 100 * this.__color.s - 7 + "px",
                    marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                    backgroundColor: "" + this.__temp,
                    border: this.__field_knob_border + "rgb(" + a + "," + a + "," + a + ")"
                }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, o(this.__saturation_field, "left", "#fff", "" + this.__temp), i.extend(this.__input.style, {
                    backgroundColor: this.__input.value = "" + this.__color,
                    color: "rgb(" + a + "," + a + "," + a + ")",
                    textShadow: this.__input_textShadow + "rgba(" + s + "," + s + "," + s + ",.7)"
                })
            }
        });
        var u = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
        return s
    }(e.controllers.Controller, e.dom.dom, e.color.Color = function(t, e, n, r) {
        function i(t, e, n) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "RGB" === this.__state.space ? this.__state[e] : (a(this, e, n), this.__state[e])
                },
                set: function(t) {
                    "RGB" !== this.__state.space && (a(this, e, n), this.__state.space = "RGB"), this.__state[e] = t
                }
            })
        }

        function o(t, e) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "HSV" === this.__state.space ? this.__state[e] : (s(this), this.__state[e])
                },
                set: function(t) {
                    "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[e] = t
                }
            })
        }

        function a(t, n, i) {
            if ("HEX" === t.__state.space) t.__state[n] = e.component_from_hex(t.__state.hex, i);
            else {
                if ("HSV" !== t.__state.space) throw "Corrupted color state";
                r.extend(t.__state, e.hsv_to_rgb(t.__state.h, t.__state.s, t.__state.v))
            }
        }

        function s(t) {
            var n = e.rgb_to_hsv(t.r, t.g, t.b);
            r.extend(t.__state, {
                s: n.s,
                v: n.v
            }), r.isNaN(n.h) ? r.isUndefined(t.__state.h) && (t.__state.h = 0) : t.__state.h = n.h
        }
        var u = function() {
            if (this.__state = t.apply(this, arguments), this.__state === !1) throw "Failed to interpret color arguments";
            this.__state.a = this.__state.a || 1
        };
        return u.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], r.extend(u.prototype, {
            toString: function() {
                return n(this)
            },
            toOriginal: function() {
                return this.__state.conversion.write(this)
            }
        }), i(u.prototype, "r", 2), i(u.prototype, "g", 1), i(u.prototype, "b", 0), o(u.prototype, "h"), o(u.prototype, "s"), o(u.prototype, "v"), Object.defineProperty(u.prototype, "a", {
            get: function() {
                return this.__state.a
            },
            set: function(t) {
                this.__state.a = t
            }
        }), Object.defineProperty(u.prototype, "hex", {
            get: function() {
                return "HEX" !== !this.__state.space && (this.__state.hex = e.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
            },
            set: function(t) {
                this.__state.space = "HEX", this.__state.hex = t
            }
        }), u
    }(e.color.interpret, e.color.math = function() {
        var t;
        return {
            hsv_to_rgb: function(t, e, n) {
                var r = Math.floor(t / 60) % 6,
                    i = t / 60 - Math.floor(t / 60),
                    o = n * (1 - e),
                    a = n * (1 - i * e),
                    s = n * (1 - (1 - i) * e),
                    u = [
                        [n, s, o],
                        [a, n, o],
                        [o, n, s],
                        [o, a, n],
                        [s, o, n],
                        [n, o, a]
                    ][r];
                return {
                    r: 255 * u[0],
                    g: 255 * u[1],
                    b: 255 * u[2]
                }
            },
            rgb_to_hsv: function(t, e, n) {
                var r, i, o = Math.min(t, e, n),
                    a = Math.max(t, e, n),
                    s = a - o;
                return 0 == a ? {
                    h: 0 / 0,
                    s: 0,
                    v: 0
                } : (i = s / a, r = t == a ? (e - n) / s : e == a ? 2 + (n - t) / s : 4 + (t - e) / s, r /= 6, 0 > r && (r += 1), {
                    h: 360 * r,
                    s: i,
                    v: a / 255
                })
            },
            rgb_to_hex: function(t, e, n) {
                var r = this.hex_with_component(0, 2, t);
                return r = this.hex_with_component(r, 1, e), r = this.hex_with_component(r, 0, n)
            },
            component_from_hex: function(t, e) {
                return t >> 8 * e & 255
            },
            hex_with_component: function(e, n, r) {
                return r << (t = 8 * n) | e & ~(255 << t)
            }
        }
    }(), e.color.toString, e.utils.common), e.color.interpret, e.utils.common), e.utils.requestAnimationFrame = function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
            window.setTimeout(t, 1e3 / 60)
        }
    }(), e.dom.CenteredDiv = function(t, e) {
        var n = function() {
            this.backgroundElement = document.createElement("div"), e.extend(this.backgroundElement.style, {
                backgroundColor: "rgba(0,0,0,0.8)",
                top: 0,
                left: 0,
                display: "none",
                zIndex: "1000",
                opacity: 0,
                WebkitTransition: "opacity 0.2s linear"
            }), t.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), e.extend(this.domElement.style, {
                position: "fixed",
                display: "none",
                zIndex: "1001",
                opacity: 0,
                WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
            }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
            var n = this;
            t.bind(this.backgroundElement, "click", function() {
                n.hide()
            })
        };
        return n.prototype.show = function() {
            var t = this;
            this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), e.defer(function() {
                t.backgroundElement.style.opacity = 1, t.domElement.style.opacity = 1, t.domElement.style.webkitTransform = "scale(1)"
            })
        }, n.prototype.hide = function() {
            var e = this,
                n = function() {
                    e.domElement.style.display = "none", e.backgroundElement.style.display = "none", t.unbind(e.domElement, "webkitTransitionEnd", n), t.unbind(e.domElement, "transitionend", n), t.unbind(e.domElement, "oTransitionEnd", n)
                };
            t.bind(this.domElement, "webkitTransitionEnd", n), t.bind(this.domElement, "transitionend", n), t.bind(this.domElement, "oTransitionEnd", n), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
        }, n.prototype.layout = function() {
            this.domElement.style.left = window.innerWidth / 2 - t.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - t.getHeight(this.domElement) / 2 + "px"
        }, n
    }(e.dom.dom, e.utils.common), e.dom.dom, e.utils.common)
}, function(t) {
    var e = t.exports = e || {};
    e.color = e.color || {}, e.utils = e.utils || {}, e.utils.common = function() {
        var t = Array.prototype.forEach,
            e = Array.prototype.slice;
        return {
            BREAK: {},
            extend: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var n in e) this.isUndefined(e[n]) || (t[n] = e[n])
                }, this), t
            },
            defaults: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var n in e) this.isUndefined(t[n]) && (t[n] = e[n])
                }, this), t
            },
            compose: function() {
                var t = e.call(arguments);
                return function() {
                    for (var n = e.call(arguments), r = t.length - 1; r >= 0; r--) n = [t[r].apply(this, n)];
                    return n[0]
                }
            },
            each: function(e, n, r) {
                if (t && e.forEach === t) e.forEach(n, r);
                else if (e.length === e.length + 0) {
                    for (var i = 0, o = e.length; o > i; i++)
                        if (i in e && n.call(r, e[i], i) === this.BREAK) return
                } else
                    for (var i in e)
                        if (n.call(r, e[i], i) === this.BREAK) return
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            toArray: function(t) {
                return t.toArray ? t.toArray() : e.call(t)
            },
            isUndefined: function(t) {
                return void 0 === t
            },
            isNull: function(t) {
                return null === t
            },
            isNaN: function(t) {
                return t !== t
            },
            isArray: Array.isArray || function(t) {
                return t.constructor === Array
            },
            isObject: function(t) {
                return t === Object(t)
            },
            isNumber: function(t) {
                return t === t + 0
            },
            isString: function(t) {
                return t === t + ""
            },
            isBoolean: function(t) {
                return t === !1 || t === !0
            },
            isFunction: function(t) {
                return "[object Function]" === Object.prototype.toString.call(t)
            }
        }
    }(), e.color.toString = function(t) {
        return function(e) {
            if (1 == e.a || t.isUndefined(e.a)) {
                for (var n = e.hex.toString(16); n.length < 6;) n = "0" + n;
                return "#" + n
            }
            return "rgba(" + Math.round(e.r) + "," + Math.round(e.g) + "," + Math.round(e.b) + "," + e.a + ")"
        }
    }(e.utils.common), e.Color = e.color.Color = function(t, e, n, r) {
        function i(t, e, n) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "RGB" === this.__state.space ? this.__state[e] : (a(this, e, n), this.__state[e])
                },
                set: function(t) {
                    "RGB" !== this.__state.space && (a(this, e, n), this.__state.space = "RGB"), this.__state[e] = t
                }
            })
        }

        function o(t, e) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "HSV" === this.__state.space ? this.__state[e] : (s(this), this.__state[e])
                },
                set: function(t) {
                    "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[e] = t
                }
            })
        }

        function a(t, n, i) {
            if ("HEX" === t.__state.space) t.__state[n] = e.component_from_hex(t.__state.hex, i);
            else {
                if ("HSV" !== t.__state.space) throw "Corrupted color state";
                r.extend(t.__state, e.hsv_to_rgb(t.__state.h, t.__state.s, t.__state.v))
            }
        }

        function s(t) {
            var n = e.rgb_to_hsv(t.r, t.g, t.b);
            r.extend(t.__state, {
                s: n.s,
                v: n.v
            }), r.isNaN(n.h) ? r.isUndefined(t.__state.h) && (t.__state.h = 0) : t.__state.h = n.h
        }
        var u = function() {
            if (this.__state = t.apply(this, arguments), this.__state === !1) throw "Failed to interpret color arguments";
            this.__state.a = this.__state.a || 1
        };
        return u.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], r.extend(u.prototype, {
            toString: function() {
                return n(this)
            },
            toOriginal: function() {
                return this.__state.conversion.write(this)
            }
        }), i(u.prototype, "r", 2), i(u.prototype, "g", 1), i(u.prototype, "b", 0), o(u.prototype, "h"), o(u.prototype, "s"), o(u.prototype, "v"), Object.defineProperty(u.prototype, "a", {
            get: function() {
                return this.__state.a
            },
            set: function(t) {
                this.__state.a = t
            }
        }), Object.defineProperty(u.prototype, "hex", {
            get: function() {
                return "HEX" !== !this.__state.space && (this.__state.hex = e.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
            },
            set: function(t) {
                this.__state.space = "HEX", this.__state.hex = t
            }
        }), u
    }(e.color.interpret = function(t, e) {
        var n, r, i = function() {
                r = !1;
                var t = arguments.length > 1 ? e.toArray(arguments) : arguments[0];
                return e.each(o, function(i) {
                    return i.litmus(t) ? (e.each(i.conversions, function(i, o) {
                        return n = i.read(t), r === !1 && n !== !1 ? (r = n, n.conversionName = o, n.conversion = i, e.BREAK) : void 0
                    }), e.BREAK) : void 0
                }), r
            },
            o = [{
                litmus: e.isString,
                conversions: {
                    THREE_CHAR_HEX: {
                        read: function(t) {
                            var e = t.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                            return null === e ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + e[1] + ("" + e[1]) + ("" + e[2]) + ("" + e[2]) + ("" + e[3]) + ("" + e[3]))
                            }
                        },
                        write: t
                    },
                    SIX_CHAR_HEX: {
                        read: function(t) {
                            var e = t.match(/^#([A-F0-9]{6})$/i);
                            return null === e ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + e[1])
                            }
                        },
                        write: t
                    },
                    CSS_RGB: {
                        read: function(t) {
                            var e = t.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                            return null === e ? !1 : {
                                space: "RGB",
                                r: parseFloat(e[1]),
                                g: parseFloat(e[2]),
                                b: parseFloat(e[3])
                            }
                        },
                        write: t
                    },
                    CSS_RGBA: {
                        read: function(t) {
                            var e = t.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                            return null === e ? !1 : {
                                space: "RGB",
                                r: parseFloat(e[1]),
                                g: parseFloat(e[2]),
                                b: parseFloat(e[3]),
                                a: parseFloat(e[4])
                            }
                        },
                        write: t
                    }
                }
            }, {
                litmus: e.isNumber,
                conversions: {
                    HEX: {
                        read: function(t) {
                            return {
                                space: "HEX",
                                hex: t,
                                conversionName: "HEX"
                            }
                        },
                        write: function(t) {
                            return t.hex
                        }
                    }
                }
            }, {
                litmus: e.isArray,
                conversions: {
                    RGB_ARRAY: {
                        read: function(t) {
                            return 3 != t.length ? !1 : {
                                space: "RGB",
                                r: t[0],
                                g: t[1],
                                b: t[2]
                            }
                        },
                        write: function(t) {
                            return [t.r, t.g, t.b]
                        }
                    },
                    RGBA_ARRAY: {
                        read: function(t) {
                            return 4 != t.length ? !1 : {
                                space: "RGB",
                                r: t[0],
                                g: t[1],
                                b: t[2],
                                a: t[3]
                            }
                        },
                        write: function(t) {
                            return [t.r, t.g, t.b, t.a]
                        }
                    }
                }
            }, {
                litmus: e.isObject,
                conversions: {
                    RGBA_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) && e.isNumber(t.a) ? {
                                space: "RGB",
                                r: t.r,
                                g: t.g,
                                b: t.b,
                                a: t.a
                            } : !1
                        },
                        write: function(t) {
                            return {
                                r: t.r,
                                g: t.g,
                                b: t.b,
                                a: t.a
                            }
                        }
                    },
                    RGB_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) ? {
                                space: "RGB",
                                r: t.r,
                                g: t.g,
                                b: t.b
                            } : !1
                        },
                        write: function(t) {
                            return {
                                r: t.r,
                                g: t.g,
                                b: t.b
                            }
                        }
                    },
                    HSVA_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) && e.isNumber(t.a) ? {
                                space: "HSV",
                                h: t.h,
                                s: t.s,
                                v: t.v,
                                a: t.a
                            } : !1
                        },
                        write: function(t) {
                            return {
                                h: t.h,
                                s: t.s,
                                v: t.v,
                                a: t.a
                            }
                        }
                    },
                    HSV_OBJ: {
                        read: function(t) {
                            return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) ? {
                                space: "HSV",
                                h: t.h,
                                s: t.s,
                                v: t.v
                            } : !1
                        },
                        write: function(t) {
                            return {
                                h: t.h,
                                s: t.s,
                                v: t.v
                            }
                        }
                    }
                }
            }];
        return i
    }(e.color.toString, e.utils.common), e.color.math = function() {
        var t;
        return {
            hsv_to_rgb: function(t, e, n) {
                var r = Math.floor(t / 60) % 6,
                    i = t / 60 - Math.floor(t / 60),
                    o = n * (1 - e),
                    a = n * (1 - i * e),
                    s = n * (1 - (1 - i) * e),
                    u = [
                        [n, s, o],
                        [a, n, o],
                        [o, n, s],
                        [o, a, n],
                        [s, o, n],
                        [n, o, a]
                    ][r];
                return {
                    r: 255 * u[0],
                    g: 255 * u[1],
                    b: 255 * u[2]
                }
            },
            rgb_to_hsv: function(t, e, n) {
                var r, i, o = Math.min(t, e, n),
                    a = Math.max(t, e, n),
                    s = a - o;
                return 0 == a ? {
                    h: 0 / 0,
                    s: 0,
                    v: 0
                } : (i = s / a, r = t == a ? (e - n) / s : e == a ? 2 + (n - t) / s : 4 + (t - e) / s, r /= 6, 0 > r && (r += 1), {
                    h: 360 * r,
                    s: i,
                    v: a / 255
                })
            },
            rgb_to_hex: function(t, e, n) {
                var r = this.hex_with_component(0, 2, t);
                return r = this.hex_with_component(r, 1, e), r = this.hex_with_component(r, 0, n)
            },
            component_from_hex: function(t, e) {
                return t >> 8 * e & 255
            },
            hex_with_component: function(e, n, r) {
                return r << (t = 8 * n) | e & ~(255 << t)
            }
        }
    }(), e.color.toString, e.utils.common)
}, function(t, e, n) {
    "use strict";

    function r(t) {
        return t && t.__esModule ? t : {
            "default": t
        }
    }

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = function() {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }(),
        a = n(50),
        s = r(a),
        u = function() {
            function t() {
                i(this, t), this._texs = []
            }
            return o(t, [{
                key: "setup",
                value: function(t) {
                    this.gl = t
                }
            }, {
                key: "getTexture",
                value: function(t) {
                    return this._texs.filter(function(e) {
                        return e.name === t
                    })[0]
                }
            }, {
                key: "makeTex",
                value: function(t, e, n, r) {
                    var i = this.gl,
                        o = this.gl.createTexture();
                    o.name = t, i.bindTexture(i.TEXTURE_2D, o), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, i.LINEAR), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, n), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, r), o.img = new Image, o.img.crossOrigin = "anonymous", o.src = e, this._texs.push(o)
                }
            }, {
                key: "loadTexture",
                value: function(t) {
                    var e = this;
                    if (t.cube) return this.loadCube(t);
                    var n = s.default.defer();
                    return t.img.onload = function() {
                        e.onTextureLoaded(t), n.resolve()
                    }, t.img.src = t.src, n.promise
                }
            }, {
                key: "loadCube",
                value: function(t) {
                    for (var e = this, n = s.default.defer(), r = 0, i = function() {
                            r += 1, r == t.imgs.length && (e.onCubeLoaded(t), n.resolve())
                        }, o = 0; o < t.imgs.length; o++) t.imgs[o].img.onload = i, t.imgs[o].img.src = t.imgs[o].src;
                    return n.promise
                }
            }, {
                key: "makeCube",
                value: function(t, e) {
                    var n = this.gl,
                        r = this.gl.createTexture();
                    r.name = t, n.bindTexture(n.TEXTURE_CUBE_MAP, r), n.texParameteri(n.TEXTURE_CUBE_MAP, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_CUBE_MAP, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_CUBE_MAP, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_CUBE_MAP, n.TEXTURE_MIN_FILTER, n.LINEAR), r.cube = !0, r.imgs = [];
                    for (var i = 0; 6 > i; i++) {
                        var o = new Image;
                        o.crossOrigin = "anonymous", r.imgs.push({
                            img: o,
                            src: ""
                        })
                    }
                    r.imgs[0].src = e + "/negx.jpg", r.imgs[1].src = e + "/negy.jpg", r.imgs[2].src = e + "/negz.jpg", r.imgs[3].src = e + "/posx.jpg", r.imgs[4].src = e + "/posy.jpg", r.imgs[5].src = e + "/posz.jpg", this._texs.push(r)
                }
            }, {
                key: "load",
                value: function() {
                    return s.default.map(this._texs, this.loadTexture.bind(this))
                }
            }, {
                key: "onTextureLoaded",
                value: function(t) {
                    var e = this.gl;
                    e.bindTexture(e.TEXTURE_2D, t), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.img), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null)
                }
            }, {
                key: "onCubeLoaded",
                value: function(t) {
                    var e = this.gl;
                    e.bindTexture(e.TEXTURE_CUBE_MAP, t), e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[0].img), e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[1].img), e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[2].img), e.texImage2D(e.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[3].img), e.texImage2D(e.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[4].img), e.texImage2D(e.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t.imgs[5].img)
                }
            }]), t
        }(),
        l = new u;
    e.default = l
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t, e, n, r) {
                var i = w.resolve(t);
                return arguments.length < 2 ? i : i.then(e, n, r)
            }

            function e(t) {
                return new w(t)
            }

            function r(t) {
                return function() {
                    for (var e = 0, n = arguments.length, r = Array(n); n > e; ++e) r[e] = arguments[e];
                    return S(t, this, r)
                }
            }

            function i(t) {
                for (var e = 0, n = arguments.length - 1, r = Array(n); n > e; ++e) r[e] = arguments[e + 1];
                return S(t, this, r)
            }

            function o() {
                return new a
            }

            function a() {
                function t(t) {
                    r._handler.resolve(t)
                }

                function e(t) {
                    r._handler.reject(t)
                }

                function n(t) {
                    r._handler.notify(t)
                }
                var r = w._defer();
                this.promise = r, this.resolve = t, this.reject = e, this.notify = n, this.resolver = {
                    resolve: t,
                    reject: e,
                    notify: n
                }
            }

            function s(t) {
                return t && "function" == typeof t.then
            }

            function u() {
                return w.all(arguments)
            }

            function l(e) {
                return t(e, w.all)
            }

            function c(e) {
                return t(e, w.settle)
            }

            function h(e, n) {
                return t(e, function(t) {
                    return w.map(t, n)
                })
            }

            function f(e, n) {
                return t(e, function(t) {
                    return w.filter(t, n)
                })
            }
            var d = n(51),
                p = n(56),
                _ = n(59),
                m = n(60),
                v = n(61),
                M = n(62),
                g = n(63),
                b = n(64),
                x = n(65),
                y = n(55),
                w = [p, _, m, M, g, v, b, d, x].reduce(function(t, e) {
                    return e(t)
                }, n(67)),
                S = n(58)(w);
            return t.promise = e, t.resolve = w.resolve, t.reject = w.reject, t.lift = r, t["try"] = i, t.attempt = i, t.iterate = w.iterate, t.unfold = w.unfold, t.join = u, t.all = l, t.settle = c, t.any = r(w.any), t.some = r(w.some), t.race = r(w.race), t.map = h, t.filter = f, t.reduce = r(w.reduce), t.reduceRight = r(w.reduceRight), t.isPromiseLike = s, t.Promise = w, t.defer = o, t.TimeoutError = y, t
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t, n, r, i) {
                return e.setTimer(function() {
                    t(r, i, n)
                }, n)
            }
            var e = n(52),
                r = n(55);
            return function(n) {
                function i(e, n, r) {
                    t(o, e, n, r)
                }

                function o(t, e) {
                    e.resolve(t)
                }

                function a(t, e, n) {
                    var i = void 0 === t ? new r("timed out after " + n + "ms") : t;
                    e.reject(i)
                }
                return n.prototype.delay = function(t) {
                    var e = this._beget();
                    return this._handler.fold(i, t, void 0, e._handler), e
                }, n.prototype.timeout = function(n, r) {
                    var i = this._beget(),
                        o = i._handler,
                        s = t(a, n, r, i._handler);
                    return this._handler.visit(o, function(t) {
                        e.clearTimer(s), this.resolve(t)
                    }, function(t) {
                        e.clearTimer(s), this.reject(t)
                    }, o.notify), i
                }, n
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r;
    (function(i) { /** @license MIT License (c) copyright 2010-2014 original author or authors */
        ! function() {
            "use strict";
            r = function(t) {
                function e() {
                    return void 0 !== i && "[object process]" === Object.prototype.toString.call(i)
                }

                function r() {
                    return "function" == typeof MutationObserver && MutationObserver || "function" == typeof WebKitMutationObserver && WebKitMutationObserver
                }

                function o(t) {
                    function e() {
                        var t = n;
                        n = void 0, t()
                    }
                    var n, r = document.createTextNode(""),
                        i = new t(e);
                    i.observe(r, {
                        characterData: !0
                    });
                    var o = 0;
                    return function(t) {
                        n = t, r.data = o ^= 1
                    }
                }
                var a, s = "undefined" != typeof setTimeout && setTimeout,
                    u = function(t, e) {
                        return setTimeout(t, e)
                    },
                    l = function(t) {
                        return clearTimeout(t)
                    },
                    c = function(t) {
                        return s(t, 0)
                    };
                if (e()) c = function(t) {
                    return i.nextTick(t)
                };
                else if (a = r()) c = o(a);
                else if (!s) {
                    var h = n(53);
                    u = function(t, e) {
                        return h.setTimer(e, t)
                    }, l = h.cancelTimer, c = h.runOnLoop || h.runOnContext
                }
                return {
                    setTimer: u,
                    clearTimer: l,
                    asap: c
                }
            }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
        }(n(54))
    }).call(e, n(6))
}, function() {}, function(t) {
    t.exports = function() {
        throw Error("define cannot be used indirect")
    }
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(e) {
                Error.call(this), this.message = e, this.name = t.name, "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, t)
            }
            return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            var t = n(57),
                e = n(58);
            return function(n) {
                function r(t) {
                    function e(t) {
                        c = null, this.resolve(t)
                    }

                    function r(t) {
                        this.resolved || (c.push(t), 0 === --l && this.reject(c))
                    }
                    for (var i, o, a = n._defer(), s = a._handler, u = t.length >>> 0, l = u, c = [], h = 0; u > h; ++h)
                        if (o = t[h], void 0 !== o || h in t) {
                            if (i = n._handler(o), i.state() > 0) {
                                s.become(i), n._visitRemaining(t, h, i);
                                break
                            }
                            i.visit(s, e, r)
                        } else --l;
                    return 0 === l && s.reject(new RangeError("any(): array must not be empty")), a
                }

                function i(t, e) {
                    function r(t) {
                        this.resolved || (c.push(t), 0 === --d && (h = null, this.resolve(c)))
                    }

                    function i(t) {
                        this.resolved || (h.push(t), 0 === --o && (c = null, this.reject(h)))
                    }
                    var o, a, s, u = n._defer(),
                        l = u._handler,
                        c = [],
                        h = [],
                        f = t.length >>> 0,
                        d = 0;
                    for (s = 0; f > s; ++s) a = t[s], (void 0 !== a || s in t) && ++d;
                    for (e = Math.max(e, 0), o = d - e + 1, d = Math.min(e, d), e > d ? l.reject(new RangeError("some(): array must contain at least " + e + " item(s), but had " + d)) : 0 === d && l.resolve(c), s = 0; f > s; ++s) a = t[s], (void 0 !== a || s in t) && n._handler(a).visit(l, r, i, l.notify);
                    return u
                }

                function o(t, e) {
                    return n._traverse(e, t)
                }

                function a(t, e) {
                    var r = M.call(t);
                    return n._traverse(e, r).then(function(t) {
                        return s(r, t)
                    })
                }

                function s(t, e) {
                    for (var r = e.length, i = Array(r), o = 0, a = 0; r > o; ++o) e[o] && (i[a++] = n._handler(t[o]).value);
                    return i.length = a, i
                }

                function u(t) {
                    return _(t.map(l))
                }

                function l(e) {
                    var r = n._handler(e);
                    return 0 === r.state() ? p(e).then(t.fulfilled, t.rejected) : (r._unreport(), t.inspect(r))
                }

                function c(t, e) {
                    return arguments.length > 2 ? m.call(t, f(e), arguments[2]) : m.call(t, f(e))
                }

                function h(t, e) {
                    return arguments.length > 2 ? v.call(t, f(e), arguments[2]) : v.call(t, f(e))
                }

                function f(t) {
                    return function(e, n, r) {
                        return d(t, void 0, [e, n, r])
                    }
                }
                var d = e(n),
                    p = n.resolve,
                    _ = n.all,
                    m = Array.prototype.reduce,
                    v = Array.prototype.reduceRight,
                    M = Array.prototype.slice;
                return n.any = r, n.some = i, n.settle = u, n.map = o, n.filter = a, n.reduce = c, n.reduceRight = h, n.prototype.spread = function(t) {
                    return this.then(_).then(function(e) {
                        return t.apply(this, e)
                    })
                }, n
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t() {
                return {
                    state: "pending"
                }
            }

            function e(t) {
                return {
                    state: "rejected",
                    reason: t
                }
            }

            function n(t) {
                return {
                    state: "fulfilled",
                    value: t
                }
            }

            function r(r) {
                var i = r.state();
                return 0 === i ? t() : i > 0 ? n(r.value) : e(r.value)
            }
            return {
                pending: t,
                fulfilled: n,
                rejected: e,
                inspect: r
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t, n) {
                function r(e, r, o) {
                    var a = t._defer(),
                        s = o.length,
                        u = Array(s);
                    return i({
                        f: e,
                        thisArg: r,
                        args: o,
                        params: u,
                        i: s - 1,
                        call: n
                    }, a._handler), a
                }

                function i(e, r) {
                    if (e.i < 0) return n(e.f, e.thisArg, e.params, r);
                    var i = t._handler(e.args[e.i]);
                    i.fold(o, e, void 0, r)
                }

                function o(t, e, n) {
                    t.params[t.i] = e, t.i -= 1, i(t, n)
                }
                return arguments.length < 2 && (n = e), r
            }

            function e(t, e, n, r) {
                try {
                    r.resolve(t.apply(e, n))
                } catch (i) {
                    r.reject(i)
                }
            }
            return t.tryCatchResolve = e, t
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t() {
                throw new TypeError("catch predicate must be a function")
            }

            function e(t, e) {
                return n(e) ? t instanceof e : e(t)
            }

            function n(t) {
                return t === Error || null != t && t.prototype instanceof Error
            }

            function r(t) {
                return ("object" == typeof t || "function" == typeof t) && null !== t
            }

            function i(t) {
                return t
            }
            return function(n) {
                function o(t, n) {
                    return function(r) {
                        return e(r, n) ? t.call(this, r) : l(r)
                    }
                }

                function a(t, e, n, i) {
                    var o = t.call(e);
                    return r(o) ? s(o, n, i) : n(i)
                }

                function s(t, e, n) {
                    return u(t).then(function() {
                        return e(n)
                    })
                }
                var u = n.resolve,
                    l = n.reject,
                    c = n.prototype["catch"];
                return n.prototype.done = function(t, e) {
                    this._handler.visit(this._handler.receiver, t, e)
                }, n.prototype["catch"] = n.prototype.otherwise = function(e) {
                    return arguments.length < 2 ? c.call(this, e) : "function" != typeof e ? this.ensure(t) : c.call(this, o(arguments[1], e))
                }, n.prototype["finally"] = n.prototype.ensure = function(t) {
                    return "function" != typeof t ? this : this.then(function(e) {
                        return a(t, this, i, e)
                    }, function(e) {
                        return a(t, this, l, e)
                    })
                }, n.prototype["else"] = n.prototype.orElse = function(t) {
                    return this.then(void 0, function() {
                        return t
                    })
                }, n.prototype["yield"] = function(t) {
                    return this.then(function() {
                        return t
                    })
                }, n.prototype.tap = function(t) {
                    return this.then(t)["yield"](this)
                }, n
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            return function(t) {
                return t.prototype.fold = function(e, n) {
                    var r = this._beget();
                    return this._handler.fold(function(n, r, i) {
                        t._handler(n).fold(function(t, n, r) {
                            r.resolve(e.call(this, n, t))
                        }, r, this, i)
                    }, n, r._handler.receiver, r._handler), r
                }, t
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            var t = n(57).inspect;
            return function(e) {
                return e.prototype.inspect = function() {
                    return t(e._handler(this))
                }, e
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            return function(t) {
                function e(t, e, r, i) {
                    return n(function(e) {
                        return [e, t(e)]
                    }, e, r, i)
                }

                function n(t, e, i, o) {
                    function a(o, a) {
                        return r(i(o)).then(function() {
                            return n(t, e, i, a)
                        })
                    }
                    return r(o).then(function(n) {
                        return r(e(n)).then(function(e) {
                            return e ? n : r(t(n)).spread(a)
                        })
                    })
                }
                var r = t.resolve;
                return t.iterate = e, t.unfold = n, t
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            return function(t) {
                return t.prototype.progress = function(t) {
                    return this.then(void 0, void 0, t)
                }, t
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            return function(t) {
                return t.prototype["with"] = t.prototype.withThis = function(t) {
                    var e = this._beget(),
                        n = e._handler;
                    return n.receiver = t, this._handler.chain(n, t), e
                }, t
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t) {
                throw t
            }

            function e() {}
            var r = n(52).setTimer,
                i = n(66);
            return function(n) {
                function o(t) {
                    t.handled || (d.push(t), c("Potentially unhandled rejection [" + t.id + "] " + i.formatError(t.value)))
                }

                function a(t) {
                    var e = d.indexOf(t);
                    0 > e || (d.splice(e, 1), h("Handled previous rejection [" + t.id + "] " + i.formatObject(t.value)))
                }

                function s(t, e) {
                    f.push(t, e), null === p && (p = r(u, 0))
                }

                function u() {
                    for (p = null; f.length > 0;) f.shift()(f.shift())
                }
                var l, c = e,
                    h = e;
                "undefined" != typeof console && (l = console, c = void 0 !== l.error ? function(t) {
                    l.error(t)
                } : function(t) {
                    l.log(t)
                }, h = void 0 !== l.info ? function(t) {
                    l.info(t)
                } : function(t) {
                    l.log(t)
                }), n.onPotentiallyUnhandledRejection = function(t) {
                    s(o, t)
                }, n.onPotentiallyUnhandledRejectionHandled = function(t) {
                    s(a, t)
                }, n.onFatalRejection = function(e) {
                    s(t, e.value)
                };
                var f = [],
                    d = [],
                    p = null;
                return n
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t) {
                var n = "object" == typeof t && null !== t && (t.stack || t.message) ? t.stack || t.message : e(t);
                return t instanceof Error ? n : n + " (WARNING: non-Error used)"
            }

            function e(t) {
                var e = t + "";
                return "[object Object]" === e && "undefined" != typeof JSON && (e = n(t, e)), e
            }

            function n(t, e) {
                try {
                    return JSON.stringify(t)
                } catch (n) {
                    return e
                }
            }
            return {
                formatError: t,
                formatObject: e,
                tryStringify: n
            }
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            var t = n(68),
                e = n(69),
                r = n(52).asap;
            return t({
                scheduler: new e(r)
            })
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    var r;
    (function(i) { /** @license MIT License (c) copyright 2010-2014 original author or authors */
        ! function() {
            "use strict";
            r = function() {
                return function(t) {
                    function e(t, e) {
                        this._handler = t === b ? e : n(t)
                    }

                    function n(t) {
                        function e(t) {
                            i.resolve(t)
                        }

                        function n(t) {
                            i.reject(t)
                        }

                        function r(t) {
                            i.notify(t)
                        }
                        var i = new y;
                        try {
                            t(e, n, r)
                        } catch (o) {
                            n(o)
                        }
                        return i
                    }

                    function r(t) {
                        return L(t) ? t : new e(b, new w(v(t)))
                    }

                    function o(t) {
                        return new e(b, new w(new E(t)))
                    }

                    function a() {
                        return te
                    }

                    function s() {
                        return new e(b, new y)
                    }

                    function u(t, e) {
                        var n = new y(t.receiver, t.join().context);
                        return new e(b, n)
                    }

                    function l(t) {
                        return h(G, null, t)
                    }

                    function c(t, e) {
                        return h(B, t, e)
                    }

                    function h(t, n, r) {
                        function i(e, i, a) {
                            a.resolved || f(r, o, e, t(n, i, e), a)
                        }

                        function o(t, e, n) {
                            c[t] = e, 0 === --l && n.become(new I(c))
                        }
                        for (var a, s = "function" == typeof n ? i : o, u = new y, l = r.length >>> 0, c = Array(l), h = 0; h < r.length && !u.resolved; ++h) a = r[h], void 0 !== a || h in r ? f(r, s, h, a, u) : --l;
                        return 0 === l && u.become(new I(c)), new e(b, u)
                    }

                    function f(t, e, n, r, i) {
                        if (z(r)) {
                            var o = M(r),
                                a = o.state();
                            0 === a ? o.fold(e, n, void 0, i) : a > 0 ? e(n, o.value, i) : (i.become(o), d(t, n + 1, o))
                        } else e(n, r, i)
                    }

                    function d(t, e, n) {
                        for (var r = e; r < t.length; ++r) p(v(t[r]), n)
                    }

                    function p(t, e) {
                        if (t !== e) {
                            var n = t.state();
                            0 === n ? t.visit(t, void 0, t._unreport) : 0 > n && t._unreport()
                        }
                    }

                    function _(t) {
                        return "object" != typeof t || null === t ? o(new TypeError("non-iterable passed to race()")) : 0 === t.length ? a() : 1 === t.length ? r(t[0]) : m(t)
                    }

                    function m(t) {
                        var n, r, i, o = new y;
                        for (n = 0; n < t.length; ++n)
                            if (r = t[n], void 0 !== r || n in t) {
                                if (i = v(r), 0 !== i.state()) {
                                    o.become(i), d(t, n + 1, i);
                                    break
                                }
                                i.visit(o, o.resolve, o.reject)
                            }
                        return new e(b, o)
                    }

                    function v(t) {
                        return L(t) ? t._handler.join() : z(t) ? g(t) : new I(t)
                    }

                    function M(t) {
                        return L(t) ? t._handler.join() : g(t)
                    }

                    function g(t) {
                        try {
                            var e = t.then;
                            return "function" == typeof e ? new S(e, t) : new I(t)
                        } catch (n) {
                            return new E(n)
                        }
                    }

                    function b() {}

                    function x() {}

                    function y(t, n) {
                        e.createContext(this, n), this.consumers = void 0, this.receiver = t, this.handler = void 0, this.resolved = !1
                    }

                    function w(t) {
                        this.handler = t
                    }

                    function S(t, e) {
                        y.call(this), W.enqueue(new T(t, e, this))
                    }

                    function I(t) {
                        e.createContext(this), this.value = t
                    }

                    function E(t) {
                        e.createContext(this), this.id = ++J, this.value = t, this.handled = !1, this.reported = !1, this._report()
                    }

                    function D(t, e) {
                        this.rejection = t, this.context = e
                    }

                    function A(t) {
                        this.rejection = t
                    }

                    function F() {
                        return new E(new TypeError("Promise cycle"))
                    }

                    function P(t, e) {
                        this.continuation = t, this.handler = e
                    }

                    function C(t, e) {
                        this.handler = e, this.value = t
                    }

                    function T(t, e, n) {
                        this._then = t, this.thenable = e, this.resolver = n
                    }

                    function R(t, e, n, r, i) {
                        try {
                            t.call(e, n, r, i)
                        } catch (o) {
                            r(o)
                        }
                    }

                    function O(t, e, n, r) {
                        this.f = t, this.z = e, this.c = n, this.to = r, this.resolver = Z, this.receiver = this
                    }

                    function L(t) {
                        return t instanceof e
                    }

                    function z(t) {
                        return ("object" == typeof t || "function" == typeof t) && null !== t
                    }

                    function k(t, n, r, i) {
                        return "function" != typeof t ? i.become(n) : (e.enterContext(n), U(t, n.value, r, i), void e.exitContext())
                    }

                    function N(t, n, r, i, o) {
                        return "function" != typeof t ? o.become(r) : (e.enterContext(r), q(t, n, r.value, i, o), void e.exitContext())
                    }

                    function j(t, n, r, i, o) {
                        return "function" != typeof t ? o.notify(n) : (e.enterContext(r), Y(t, n, i, o), void e.exitContext())
                    }

                    function B(t, e, n) {
                        try {
                            return t(e, n)
                        } catch (r) {
                            return o(r)
                        }
                    }

                    function U(t, e, n, r) {
                        try {
                            r.become(v(t.call(n, e)))
                        } catch (i) {
                            r.become(new E(i))
                        }
                    }

                    function q(t, e, n, r, i) {
                        try {
                            t.call(r, e, n, i)
                        } catch (o) {
                            i.become(new E(o))
                        }
                    }

                    function Y(t, e, n, r) {
                        try {
                            r.notify(t.call(n, e))
                        } catch (i) {
                            r.notify(i)
                        }
                    }

                    function V(t, e) {
                        e.prototype = K(t.prototype), e.prototype.constructor = e
                    }

                    function G(t, e) {
                        return e
                    }

                    function H() {}

                    function X() {
                        return void 0 !== i && null !== i && "function" == typeof i.emit ? function(t, e) {
                            return "unhandledRejection" === t ? i.emit(t, e.value, e) : i.emit(t, e)
                        } : "undefined" != typeof self && "function" == typeof CustomEvent ? function(t, e, n) {
                            var r = !1;
                            try {
                                var i = new n("unhandledRejection");
                                r = i instanceof n
                            } catch (o) {}
                            return r ? function(t, r) {
                                var i = new n(t, {
                                    detail: {
                                        reason: r.value,
                                        key: r
                                    },
                                    bubbles: !1,
                                    cancelable: !0
                                });
                                return !e.dispatchEvent(i)
                            } : t
                        }(H, self, CustomEvent) : H
                    }
                    var W = t.scheduler,
                        Q = X(),
                        K = Object.create || function(t) {
                            function e() {}
                            return e.prototype = t, new e
                        };
                    e.resolve = r, e.reject = o, e.never = a, e._defer = s, e._handler = v, e.prototype.then = function(t, e, n) {
                        var r = this._handler,
                            i = r.join().state();
                        if ("function" != typeof t && i > 0 || "function" != typeof e && 0 > i) return new this.constructor(b, r);
                        var o = this._beget(),
                            a = o._handler;
                        return r.chain(a, r.receiver, t, e, n), o
                    }, e.prototype["catch"] = function(t) {
                        return this.then(void 0, t)
                    }, e.prototype._beget = function() {
                        return u(this._handler, this.constructor)
                    }, e.all = l, e.race = _, e._traverse = c, e._visitRemaining = d, b.prototype.when = b.prototype.become = b.prototype.notify = b.prototype.fail = b.prototype._unreport = b.prototype._report = H, b.prototype._state = 0, b.prototype.state = function() {
                        return this._state
                    }, b.prototype.join = function() {
                        for (var t = this; void 0 !== t.handler;) t = t.handler;
                        return t
                    }, b.prototype.chain = function(t, e, n, r, i) {
                        this.when({
                            resolver: t,
                            receiver: e,
                            fulfilled: n,
                            rejected: r,
                            progress: i
                        })
                    }, b.prototype.visit = function(t, e, n, r) {
                        this.chain(Z, t, e, n, r)
                    }, b.prototype.fold = function(t, e, n, r) {
                        this.when(new O(t, e, n, r))
                    }, V(b, x), x.prototype.become = function(t) {
                        t.fail()
                    };
                    var Z = new x;
                    V(b, y), y.prototype._state = 0, y.prototype.resolve = function(t) {
                        this.become(v(t))
                    }, y.prototype.reject = function(t) {
                        this.resolved || this.become(new E(t))
                    }, y.prototype.join = function() {
                        if (!this.resolved) return this;
                        for (var t = this; void 0 !== t.handler;)
                            if (t = t.handler, t === this) return this.handler = F();
                        return t
                    }, y.prototype.run = function() {
                        var t = this.consumers,
                            e = this.handler;
                        this.handler = this.handler.join(), this.consumers = void 0;
                        for (var n = 0; n < t.length; ++n) e.when(t[n])
                    }, y.prototype.become = function(t) {
                        this.resolved || (this.resolved = !0, this.handler = t, void 0 !== this.consumers && W.enqueue(this), void 0 !== this.context && t._report(this.context))
                    }, y.prototype.when = function(t) {
                        this.resolved ? W.enqueue(new P(t, this.handler)) : void 0 === this.consumers ? this.consumers = [t] : this.consumers.push(t)
                    }, y.prototype.notify = function(t) {
                        this.resolved || W.enqueue(new C(t, this))
                    }, y.prototype.fail = function(t) {
                        var e = void 0 === t ? this.context : t;
                        this.resolved && this.handler.join().fail(e)
                    }, y.prototype._report = function(t) {
                        this.resolved && this.handler.join()._report(t)
                    }, y.prototype._unreport = function() {
                        this.resolved && this.handler.join()._unreport()
                    }, V(b, w), w.prototype.when = function(t) {
                        W.enqueue(new P(t, this))
                    }, w.prototype._report = function(t) {
                        this.join()._report(t)
                    }, w.prototype._unreport = function() {
                        this.join()._unreport()
                    }, V(y, S), V(b, I), I.prototype._state = 1, I.prototype.fold = function(t, e, n, r) {
                        N(t, e, this, n, r)
                    }, I.prototype.when = function(t) {
                        k(t.fulfilled, this, t.receiver, t.resolver)
                    };
                    var J = 0;
                    V(b, E), E.prototype._state = -1, E.prototype.fold = function(t, e, n, r) {
                        r.become(this)
                    }, E.prototype.when = function(t) {
                        "function" == typeof t.rejected && this._unreport(), k(t.rejected, this, t.receiver, t.resolver)
                    }, E.prototype._report = function(t) {
                        W.afterQueue(new D(this, t))
                    }, E.prototype._unreport = function() {
                        this.handled || (this.handled = !0, W.afterQueue(new A(this)))
                    }, E.prototype.fail = function(t) {
                        this.reported = !0, Q("unhandledRejection", this), e.onFatalRejection(this, void 0 === t ? this.context : t)
                    }, D.prototype.run = function() {
                        this.rejection.handled || this.rejection.reported || (this.rejection.reported = !0, Q("unhandledRejection", this.rejection) || e.onPotentiallyUnhandledRejection(this.rejection, this.context))
                    }, A.prototype.run = function() {
                        this.rejection.reported && (Q("rejectionHandled", this.rejection) || e.onPotentiallyUnhandledRejectionHandled(this.rejection))
                    }, e.createContext = e.enterContext = e.exitContext = e.onPotentiallyUnhandledRejection = e.onPotentiallyUnhandledRejectionHandled = e.onFatalRejection = H;
                    var $ = new b,
                        te = new e(b, $);
                    return P.prototype.run = function() {
                        this.handler.join().when(this.continuation)
                    }, C.prototype.run = function() {
                        var t = this.handler.consumers;
                        if (void 0 !== t)
                            for (var e, n = 0; n < t.length; ++n) e = t[n], j(e.progress, this.value, this.handler, e.receiver, e.resolver)
                    }, T.prototype.run = function() {
                        function t(t) {
                            r.resolve(t)
                        }

                        function e(t) {
                            r.reject(t)
                        }

                        function n(t) {
                            r.notify(t)
                        }
                        var r = this.resolver;
                        R(this._then, this.thenable, t, e, n)
                    }, O.prototype.fulfilled = function(t) {
                        this.f.call(this.c, this.z, t, this.to)
                    }, O.prototype.rejected = function(t) {
                        this.to.reject(t)
                    }, O.prototype.progress = function(t) {
                        this.to.notify(t)
                    }, e
                }
            }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
        }(n(54))
    }).call(e, n(6))
}, function(t, e, n) {
    var r; /** @license MIT License (c) copyright 2010-2014 original author or authors */
    ! function() {
        "use strict";
        r = function() {
            function t(t) {
                this._async = t, this._running = !1, this._queue = this, this._queueLen = 0, this._afterQueue = {}, this._afterQueueLen = 0;
                var e = this;
                this.drain = function() {
                    e._drain()
                }
            }
            return t.prototype.enqueue = function(t) {
                this._queue[this._queueLen++] = t, this.run()
            }, t.prototype.afterQueue = function(t) {
                this._afterQueue[this._afterQueueLen++] = t, this.run()
            }, t.prototype.run = function() {
                this._running || (this._running = !0, this._async(this.drain))
            }, t.prototype._drain = function() {
                for (var t = 0; t < this._queueLen; ++t) this._queue[t].run(), this._queue[t] = void 0;
                for (this._queueLen = 0, this._running = !1, t = 0; t < this._afterQueueLen; ++t) this._afterQueue[t].run(), this._afterQueue[t] = void 0;
                this._afterQueueLen = 0
            }, t
        }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
    }(n(54))
}, function(t, e, n) {
    function r(t) {
        return n(i(t))
    }

    function i(t) {
        return o[t] || function() {
            throw Error("Cannot find module '" + t + "'.")
        }()
    }
    var o = {
        "./basic2D.vert": 71,
        "./basic3D.vert": 72,
        "./pyramid-glass.vert": 73
    };
    r.keys = function() {
        return Object.keys(o)
    }, r.resolve = i, t.exports = r, r.id = 70
}, function(t) {
    t.exports = "#define GLSLIFY 1\nattribute vec2 aPosition;\nattribute vec2 aUv;\n\nuniform mat4 uMVP;\n\nvarying vec2 vUv;\n\n\nvoid main(){\n\n  gl_Position = uMVP * vec4( aPosition, 0.0, 1.0 );\n\n  vUv = aUv;\n\n}"
}, function(t) {
    t.exports = "#define GLSLIFY 1\nattribute vec3 aPosition;\nattribute vec3 aColor;\nattribute vec2 aUv;\n\nuniform mat4 uProjectionMatrix;\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\nuniform mat4 uModelMatrix;\n\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying vec2 vUv;\n\nvoid main(){\n  // uM\n  // uWorldMatrix\n  // uMVP\n  // gl_Position = uMVP * vec4( aPosition.xy, 1.0,  1.0 );\n\n  gl_Position = uMVP * vec4( aPosition,  1.0 );\n\n  vPosition = aPosition; \n  vColor = aColor;\n  vUv = aUv;\n\n}"
}, function(t) {
    t.exports = "#define GLSLIFY 1\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec3 aBasePosition;\nattribute vec3 aColor;\nattribute float aSpeed;\n\nuniform float uTime;\nuniform mat4 uProjectionMatrix;\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\nuniform mat4 uModelMatrix;\nuniform float uScale;\n\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_2_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_2_0(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_2_1(vec4 x) {\n     return mod289_2_0(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_2_2(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise_2_3(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D_2_4 = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g_2_5 = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g_2_5;\n  vec3 i1 = min( g_2_5.xyz, l.zxy );\n  vec3 i2 = max( g_2_5.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D_2_4.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_2_0(i);\n  vec4 p = permute_2_1( permute_2_1( permute_2_1(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D_2_4.wyz - D_2_4.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1_2_6 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0_2_7 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1_2_6.xy,h.z);\n  vec3 p3 = vec3(a1_2_6.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt_2_2(vec4(dot(p0_2_7,p0_2_7), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0_2_7 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0_2_7,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\n\n\n\nvec3 snoiseVec3_1_8( vec3 x ){\n\n  float s  = snoise_2_3(vec3( x ));\n  float s1 = snoise_2_3(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));\n  float s2 = snoise_2_3(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));\n  vec3 c = vec3( s , s1 , s2 );\n  return c;\n\n}\n\n\nvec3 curlNoise_1_9( vec3 p ){\n  \n  const float e = .1;\n  vec3 dx = vec3( e   , 0.0 , 0.0 );\n  vec3 dy = vec3( 0.0 , e   , 0.0 );\n  vec3 dz = vec3( 0.0 , 0.0 , e   );\n\n  vec3 p_x0 = snoiseVec3_1_8( p - dx );\n  vec3 p_x1 = snoiseVec3_1_8( p + dx );\n  vec3 p_y0 = snoiseVec3_1_8( p - dy );\n  vec3 p_y1 = snoiseVec3_1_8( p + dy );\n  vec3 p_z0 = snoiseVec3_1_8( p - dz );\n  vec3 p_z1 = snoiseVec3_1_8( p + dz );\n\n  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;\n  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;\n  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;\n\n  const float divisor = 1.0 / ( 2.0 * e );\n  return normalize( vec3( x , y , z ) * divisor );\n\n}\n\n\n\nvoid main(){\n\n  vec3 p = mix( aPosition, aBasePosition, abs( sin( uTime * aSpeed + aSpeed ) ) );\n  vec3 n = curlNoise_1_9( (p*0.1) + uTime * 0.15 );// * (2.0 * abs( sin( uTime * aSpeed + aPosition.x ) ) );\n  p += n * uScale;\n  // p = mix( aPosition, aBasePosition, abs( sin( uTime * aSpeed ) ) );\n  gl_Position = uMVP * vec4( p,  1.0 );\n\n  gl_PointSize = 4.;//clamp( ( 10.0 ) * ( 1.0 - length( aPosition )/5.0 ), 0.0, 10.0 );\n  vPosition = aPosition; \n  vColor = aColor * length( n );\n  vNormal = normalize( aNormal + n * uScale );\n\n}"
}, function(t, e, n) {
    function r(t) {
        return n(i(t))
    }

    function i(t) {
        return o[t] || function() {
            throw Error("Cannot find module '" + t + "'.")
        }()
    }
    var o = {
        "./basic2D.frag": 75,
        "./basic3D.frag": 76,
        "./pyramid-glass.frag": 77
    };
    r.keys = function() {
        return Object.keys(o)
    }, r.resolve = i, t.exports = r, r.id = 74
}, function(t) {
    t.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main(){\n\n  vec3 color = vec3(1.0);\n\n  gl_FragColor = vec4( color, 1.0 ); \n\n}"
}, function(t) {
    t.exports = "#define GLSLIFY 1\nuniform float uTime;\n\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying vec2 vUv;\n\nvoid main(){\n\n  float toto = uTime;\n\n  // position color\n  vec3 color = vec3( vPosition.x * 0.5, vPosition.y * 0.5 + 0.5, vPosition.z );\n  \n  // attribute color\n  // color = vColor;\n\n  // texture color\n  // color = texture2D( uTexture, vUv ).rgb;\n\n  gl_FragColor = vec4( color, 1.0 ); \n\n}"
}, function(t) {
    t.exports = "#define GLSLIFY 1\nuniform float uTime;\n// uniform samplerCube tCube;\n\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nfloat rand(vec2 co){\n  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvoid main(){\n\n  vec3 dir = vNormal;\n  dir.y = -dir.y;\n  \n  // vec4 color = textureCube( tCube, dir );\n  // attribute color\n  // vec3 color = vColor;\n\n  vec3 c = vec3( vColor + vNormal * + dir.x );\n\n  gl_FragColor = vec4( c, rand(vPosition.xy) ); \n\n}"
}]);