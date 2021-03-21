var t = window = this;
if (!e)
    var e = {
        appName: "Netscape",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
    };
if (!r)
    var r = {
        ASN1: null,
        Base64: null,
        Hex: null,
        crypto: null,
        href: null
    };
function n(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t);
}
function i(t, e) {
    return t & e;
}
function o(t, e) {
    return t | e;
}
function s(t, e) {
    return t ^ e;
}
function a(t, e) {
    return t & ~e;
}
function c(t) {
    if (0 == t)
        return -1;
    var e = 0;
    return 0 == (65535 & t) && (t >>= 16,
    e += 16),
    0 == (255 & t) && (t >>= 8,
    e += 8),
    0 == (15 & t) && (t >>= 4,
    e += 4),
    0 == (3 & t) && (t >>= 2,
    e += 2),
    0 == (1 & t) && ++e,
    e;
}
function u(t) {
    for (var e = 0; 0 != t; )
        t &= t - 1,
        ++e;
    return e;
}
var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function f(t) {
    var e, r, n = "";
    for (e = 0; e + 3 <= t.length; e += 3)
        r = parseInt(t.substring(e, e + 3), 16),
        n += h.charAt(r >> 6) + h.charAt(63 & r);
    for (e + 1 == t.length ? (r = parseInt(t.substring(e, e + 1), 16),
    n += h.charAt(r << 2)) : e + 2 == t.length && (r = parseInt(t.substring(e, e + 2), 16),
    n += h.charAt(r >> 2) + h.charAt((3 & r) << 4)); (3 & n.length) > 0; )
        n += "=";
    return n;
}
function p(t) {
    var e, r = "", i = 0, o = 0;
    for (e = 0; e < t.length && "=" != t.charAt(e); ++e) {
        var s = h.indexOf(t.charAt(e));
        s < 0 || (0 == i ? (r += n(s >> 2),
        o = 3 & s,
        i = 1) : 1 == i ? (r += n(o << 2 | s >> 4),
        o = 15 & s,
        i = 2) : 2 == i ? (r += n(o),
        r += n(s >> 2),
        o = 3 & s,
        i = 3) : (r += n(o << 2 | s >> 4),
        r += n(15 & s),
        i = 0));
    }
    return 1 == i && (r += n(o << 2)),
    r;
}
var l, y, d = function(t, e) {
    return (d = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e;
    }
    || function(t, e) {
        for (var r in e)
            e.hasOwnProperty(r) && (t[r] = e[r]);
    }
    )(t, e);
}, g = {
    decode: function(t) {
        var e;
        if (void 0 === y) {
            var r = "= \f\n\r\t?\u2028\u2029";
            for (y = Object.create(null),
            e = 0; e < 64; ++e)
                y["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)] = e;
            for (e = 0; e < r.length; ++e)
                y[r.charAt(e)] = -1;
        }
        var n = []
          , i = 0
          , o = 0;
        for (e = 0; e < t.length; ++e) {
            var s = t.charAt(e);
            if ("=" == s)
                break;
            if (-1 != (s = y[s])) {
                if (void 0 === s)
                    throw new Error("Illegal character at offset " + e);
                i |= s,
                ++o >= 4 ? (n[n.length] = i >> 16,
                n[n.length] = i >> 8 & 255,
                n[n.length] = 255 & i,
                i = 0,
                o = 0) : i <<= 6;
            }
        }
        switch (o) {
        case 1:
            throw new Error("Base64 encoding incomplete: at least 2 bits missing");

        case 2:
            n[n.length] = i >> 10;
            break;

        case 3:
            n[n.length] = i >> 16,
            n[n.length] = i >> 8 & 255;
        }
        return n;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function(t) {
        var e = g.re.exec(t);
        if (e)
            if (e[1])
                t = e[1];
            else {
                if (!e[2])
                    throw new Error("RegExp out of sync");
                t = e[2];
            }
        return g.decode(t);
    }
}, m = 1e13, v = function() {
    function t(t) {
        this.buf = [+t || 0];
    }
    return t.prototype.mulAdd = function(t, e) {
        var r, n, i = this.buf, o = i.length;
        for (r = 0; r < o; ++r)
            (n = i[r] * t + e) < m ? e = 0 : n -= (e = 0 | n / m) * m,
            i[r] = n;
        e > 0 && (i[r] = e);
    }
    ,
    t.prototype.sub = function(t) {
        var e, r, n = this.buf, i = n.length;
        for (e = 0; e < i; ++e)
            (r = n[e] - t) < 0 ? (r += m,
            t = 1) : t = 0,
            n[e] = r;
        for (; 0 === n[n.length - 1]; )
            n.pop();
    }
    ,
    t.prototype.toString = function(t) {
        if (10 != (t || 10))
            throw new Error("only base 10 is supported");
        for (var e = this.buf, r = e[e.length - 1].toString(), n = e.length - 2; n >= 0; --n)
            r += (m + e[n]).toString().substring(1);
        return r;
    }
    ,
    t.prototype.valueOf = function() {
        for (var t = this.buf, e = 0, r = t.length - 1; r >= 0; --r)
            e = e * m + t[r];
        return e;
    }
    ,
    t.prototype.simplify = function() {
        var t = this.buf;
        return 1 == t.length ? t[0] : this;
    }
    ,
    t;
}(), b = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, S = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function _(t, e) {
    return t.length > e && (t = t.substring(0, e) + "…"),
    t;
}
var w, x = function() {
    function t(e, r) {
        this.hexDigits = "0123456789ABCDEF",
        e instanceof t ? (this.enc = e.enc,
        this.pos = e.pos) : (this.enc = e,
        this.pos = r);
    }
    return t.prototype.get = function(t) {
        if (void 0 === t && (t = this.pos++),
        t >= this.enc.length)
            throw new Error("Requesting byte offset " + t + " on a stream of length " + this.enc.length);
        return "string" == typeof this.enc ? this.enc.charCodeAt(t) : this.enc[t];
    }
    ,
    t.prototype.hexByte = function(t) {
        return this.hexDigits.charAt(t >> 4 & 15) + this.hexDigits.charAt(15 & t);
    }
    ,
    t.prototype.hexDump = function(t, e, r) {
        for (var n = "", i = t; i < e; ++i)
            if (n += this.hexByte(this.get(i)),
            !0 !== r)
                switch (15 & i) {
                case 7:
                    n += "  ";
                    break;

                case 15:
                    n += "\n";
                    break;

                default:
                    n += " ";
                }
        return n;
    }
    ,
    t.prototype.isASCII = function(t, e) {
        for (var r = t; r < e; ++r) {
            var n = this.get(r);
            if (n < 32 || n > 176)
                return !1;
        }
        return !0;
    }
    ,
    t.prototype.parseStringISO = function(t, e) {
        for (var r = "", n = t; n < e; ++n)
            r += String.fromCharCode(this.get(n));
        return r;
    }
    ,
    t.prototype.parseStringUTF = function(t, e) {
        for (var r = "", n = t; n < e; ) {
            var i = this.get(n++);
            r += i < 128 ? String.fromCharCode(i) : i > 191 && i < 224 ? String.fromCharCode((31 & i) << 6 | 63 & this.get(n++)) : String.fromCharCode((15 & i) << 12 | (63 & this.get(n++)) << 6 | 63 & this.get(n++));
        }
        return r;
    }
    ,
    t.prototype.parseStringBMP = function(t, e) {
        for (var r, n, i = "", o = t; o < e; )
            r = this.get(o++),
            n = this.get(o++),
            i += String.fromCharCode(r << 8 | n);
        return i;
    }
    ,
    t.prototype.parseTime = function(t, e, r) {
        var n = this.parseStringISO(t, e)
          , i = (r ? b : S).exec(n);
        return i ? (r && (i[1] = +i[1],
        i[1] += +i[1] < 70 ? 2e3 : 1900),
        n = i[1] + "-" + i[2] + "-" + i[3] + " " + i[4],
        i[5] && (n += ":" + i[5],
        i[6] && (n += ":" + i[6],
        i[7] && (n += "." + i[7]))),
        i[8] && (n += " UTC",
        "Z" != i[8] && (n += i[8],
        i[9] && (n += ":" + i[9]))),
        n) : "Unrecognized time: " + n;
    }
    ,
    t.prototype.parseInteger = function(t, e) {
        for (var r, n = this.get(t), i = n > 127, o = i ? 255 : 0, s = ""; n == o && ++t < e; )
            n = this.get(t);
        if (0 == (r = e - t))
            return i ? -1 : 0;
        if (r > 4) {
            for (s = n,
            r <<= 3; 0 == (128 & (+s ^ o)); )
                s = +s << 1,
                --r;
            s = "(" + r + " bit)\n";
        }
        i && (n -= 256);
        for (var a = new v(n), c = t + 1; c < e; ++c)
            a.mulAdd(256, this.get(c));
        return s + a.toString();
    }
    ,
    t.prototype.parseBitString = function(t, e, r) {
        for (var n = this.get(t), i = "(" + ((e - t - 1 << 3) - n) + " bit)\n", o = "", s = t + 1; s < e; ++s) {
            for (var a = this.get(s), c = s == e - 1 ? n : 0, u = 7; u >= c; --u)
                o += a >> u & 1 ? "1" : "0";
            if (o.length > r)
                return i + _(o, r);
        }
        return i + o;
    }
    ,
    t.prototype.parseOctetString = function(t, e, r) {
        if (this.isASCII(t, e))
            return _(this.parseStringISO(t, e), r);
        var n = e - t
          , i = "(" + n + " byte)\n";
        n > (r /= 2) && (e = t + r);
        for (var o = t; o < e; ++o)
            i += this.hexByte(this.get(o));
        return n > r && (i += "…"),
        i;
    }
    ,
    t.prototype.parseOID = function(t, e, r) {
        for (var n = "", i = new v(), o = 0, s = t; s < e; ++s) {
            var a = this.get(s);
            if (i.mulAdd(128, 127 & a),
            o += 7,
            !(128 & a)) {
                if ("" === n)
                    if ((i = i.simplify())instanceof v)
                        i.sub(80),
                        n = "2." + i.toString();
                    else {
                        var c = i < 80 ? i < 40 ? 0 : 1 : 2;
                        n = c + "." + (i - 40 * c);
                    }
                else
                    n += "." + i.toString();
                if (n.length > r)
                    return _(n, r);
                i = new v(),
                o = 0;
            }
        }
        return o > 0 && (n += ".incomplete"),
        n;
    }
    ,
    t;
}(), T = function() {
    function t(t, e, r, n, i) {
        if (!(n instanceof E))
            throw new Error("Invalid tag value.");
        this.stream = t,
        this.header = e,
        this.length = r,
        this.tag = n,
        this.sub = i;
    }
    return t.prototype.typeName = function() {
        switch (this.tag.tagClass) {
        case 0:
            switch (this.tag.tagNumber) {
            case 0:
                return "EOC";

            case 1:
                return "BOOLEAN";

            case 2:
                return "INTEGER";

            case 3:
                return "BIT_STRING";

            case 4:
                return "OCTET_STRING";

            case 5:
                return "NULL";

            case 6:
                return "OBJECT_IDENTIFIER";

            case 7:
                return "ObjectDescriptor";

            case 8:
                return "EXTERNAL";

            case 9:
                return "REAL";

            case 10:
                return "ENUMERATED";

            case 11:
                return "EMBEDDED_PDV";

            case 12:
                return "UTF8String";

            case 16:
                return "SEQUENCE";

            case 17:
                return "SET";

            case 18:
                return "NumericString";

            case 19:
                return "PrintableString";

            case 20:
                return "TeletexString";

            case 21:
                return "VideotexString";

            case 22:
                return "IA5String";

            case 23:
                return "UTCTime";

            case 24:
                return "GeneralizedTime";

            case 25:
                return "GraphicString";

            case 26:
                return "VisibleString";

            case 27:
                return "GeneralString";

            case 28:
                return "UniversalString";

            case 30:
                return "BMPString";
            }
            return "Universal_" + this.tag.tagNumber.toString();

        case 1:
            return "Application_" + this.tag.tagNumber.toString();

        case 2:
            return "[" + this.tag.tagNumber.toString() + "]";

        case 3:
            return "Private_" + this.tag.tagNumber.toString();
        }
    }
    ,
    t.prototype.content = function(t) {
        if (void 0 === this.tag)
            return null;
        void 0 === t && (t = 1 / 0);
        var e = this.posContent()
          , r = Math.abs(this.length);
        if (!this.tag.isUniversal())
            return null !== this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + r, t);
        switch (this.tag.tagNumber) {
        case 1:
            return 0 === this.stream.get(e) ? "false" : "true";

        case 2:
            return this.stream.parseInteger(e, e + r);

        case 3:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(e, e + r, t);

        case 4:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + r, t);

        case 6:
            return this.stream.parseOID(e, e + r, t);

        case 16:
        case 17:
            return null !== this.sub ? "(" + this.sub.length + " elem)" : "(no elem)";

        case 12:
            return _(this.stream.parseStringUTF(e, e + r), t);

        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 26:
            return _(this.stream.parseStringISO(e, e + r), t);

        case 30:
            return _(this.stream.parseStringBMP(e, e + r), t);

        case 23:
        case 24:
            return this.stream.parseTime(e, e + r, 23 == this.tag.tagNumber);
        }
        return null;
    }
    ,
    t.prototype.toString = function() {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]";
    }
    ,
    t.prototype.toPrettyString = function(t) {
        void 0 === t && (t = "");
        var e = t + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0 && (e += "+"),
        e += this.length,
        this.tag.tagConstructed ? e += " (constructed)" : !this.tag.isUniversal() || 3 != this.tag.tagNumber && 4 != this.tag.tagNumber || null === this.sub || (e += " (encapsulates)"),
        e += "\n",
        null !== this.sub) {
            t += "  ";
            for (var r = 0, n = this.sub.length; r < n; ++r)
                e += this.sub[r].toPrettyString(t);
        }
        return e;
    }
    ,
    t.prototype.posStart = function() {
        return this.stream.pos;
    }
    ,
    t.prototype.posContent = function() {
        return this.stream.pos + this.header;
    }
    ,
    t.prototype.posEnd = function() {
        return this.stream.pos + this.header + Math.abs(this.length);
    }
    ,
    t.prototype.toHexString = function() {
        return this.stream.hexDump(this.posStart(), this.posEnd(), !0);
    }
    ,
    t.decodeLength = function(t) {
        var e = t.get()
          , r = 127 & e;
        if (r == e)
            return r;
        if (r > 6)
            throw new Error("Length over 48 bits not supported at position " + (t.pos - 1));
        if (0 === r)
            return null;
        e = 0;
        for (var n = 0; n < r; ++n)
            e = 256 * e + t.get();
        return e;
    }
    ,
    t.prototype.getHexStringValue = function() {
        var t = this.toHexString()
          , e = 2 * this.header
          , r = 2 * this.length;
        return t.substr(e, r);
    }
    ,
    t.decode = function(e) {
        var r;
        r = e instanceof x ? e : new x(e,0);
        var n = new x(r)
          , i = new E(r)
          , o = t.decodeLength(r)
          , s = r.pos
          , a = s - n.pos
          , c = null
          , u = function() {
            var e = [];
            if (null !== o) {
                for (var n = s + o; r.pos < n; )
                    e[e.length] = t.decode(r);
                if (r.pos != n)
                    throw new Error("Content size is not correct for container starting at offset " + s);
            } else
                try {
                    for (; ; ) {
                        var i = t.decode(r);
                        if (i.tag.isEOC())
                            break;
                        e[e.length] = i;
                    }
                    o = s - r.pos;
                } catch (t) {
                    throw new Error("Exception while decoding undefined length content: " + t);
                }
            return e;
        };
        if (i.tagConstructed)
            c = u();
        else if (i.isUniversal() && (3 == i.tagNumber || 4 == i.tagNumber))
            try {
                if (3 == i.tagNumber && 0 != r.get())
                    throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                c = u();
                for (var h = 0; h < c.length; ++h)
                    if (c[h].tag.isEOC())
                        throw new Error("EOC is not supposed to be actual content.");
            } catch (t) {
                c = null;
            }
        if (null === c) {
            if (null === o)
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + s);
            r.pos = s + Math.abs(o);
        }
        return new t(n,a,o,i,c);
    }
    ,
    t;
}(), E = function() {
    function t(t) {
        var e = t.get();
        if (this.tagClass = e >> 6,
        this.tagConstructed = 0 != (32 & e),
        this.tagNumber = 31 & e,
        31 == this.tagNumber) {
            var r = new v();
            do {
                e = t.get(),
                r.mulAdd(128, 127 & e);
            } while (128 & e);this.tagNumber = r.simplify();
        }
    }
    return t.prototype.isUniversal = function() {
        return 0 === this.tagClass;
    }
    ,
    t.prototype.isEOC = function() {
        return 0 === this.tagClass && 0 === this.tagNumber;
    }
    ,
    t;
}(), B = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], A = 67108864 / B[B.length - 1], D = function() {
    function t(t, e, r) {
        null != t && ("number" == typeof t ? this.fromNumber(t, e, r) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e));
    }
    return t.prototype.toString = function(t) {
        if (this.s < 0)
            return "-" + this.negate().toString(t);
        var e;
        if (16 == t)
            e = 4;
        else if (8 == t)
            e = 3;
        else if (2 == t)
            e = 1;
        else if (32 == t)
            e = 5;
        else {
            if (4 != t)
                return this.toRadix(t);
            e = 2;
        }
        var r, i = (1 << e) - 1, o = !1, s = "", a = this.t, c = this.DB - a * this.DB % e;
        if (a-- > 0)
            for (c < this.DB && (r = this[a] >> c) > 0 && (o = !0,
            s = n(r)); a >= 0; )
                c < e ? (r = (this[a] & (1 << c) - 1) << e - c,
                r |= this[--a] >> (c += this.DB - e)) : (r = this[a] >> (c -= e) & i,
                c <= 0 && (c += this.DB,
                --a)),
                r > 0 && (o = !0),
                o && (s += n(r));
        return o ? s : "0";
    }
    ,
    t.prototype.negate = function() {
        var e = I();
        return t.ZERO.subTo(this, e),
        e;
    }
    ,
    t.prototype.abs = function() {
        return this.s < 0 ? this.negate() : this;
    }
    ,
    t.prototype.compareTo = function(t) {
        var e = this.s - t.s;
        if (0 != e)
            return e;
        var r = this.t;
        if (0 != (e = r - t.t))
            return this.s < 0 ? -e : e;
        for (; --r >= 0; )
            if (0 != (e = this[r] - t[r]))
                return e;
        return 0;
    }
    ,
    t.prototype.bitLength = function() {
        return this.t <= 0 ? 0 : this.DB * (this.t - 1) + F(this[this.t - 1] ^ this.s & this.DM);
    }
    ,
    t.prototype.mod = function(e) {
        var r = I();
        return this.abs().divRemTo(e, null, r),
        this.s < 0 && r.compareTo(t.ZERO) > 0 && e.subTo(r, r),
        r;
    }
    ,
    t.prototype.modPowInt = function(t, e) {
        var r;
        return r = t < 256 || e.isEven() ? new k(e) : new R(e),
        this.exp(t, r);
    }
    ,
    t.prototype.clone = function() {
        var t = I();
        return this.copyTo(t),
        t;
    }
    ,
    t.prototype.intValue = function() {
        if (this.s < 0) {
            if (1 == this.t)
                return this[0] - this.DV;
            if (0 == this.t)
                return -1;
        } else {
            if (1 == this.t)
                return this[0];
            if (0 == this.t)
                return 0;
        }
        return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    }
    ,
    t.prototype.byteValue = function() {
        return 0 == this.t ? this.s : this[0] << 24 >> 24;
    }
    ,
    t.prototype.shortValue = function() {
        return 0 == this.t ? this.s : this[0] << 16 >> 16;
    }
    ,
    t.prototype.signum = function() {
        return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1;
    }
    ,
    t.prototype.toByteArray = function() {
        var t = this.t
          , e = [];
        e[0] = this.s;
        var r, n = this.DB - t * this.DB % 8, i = 0;
        if (t-- > 0)
            for (n < this.DB && (r = this[t] >> n) != (this.s & this.DM) >> n && (e[i++] = r | this.s << this.DB - n); t >= 0; )
                n < 8 ? (r = (this[t] & (1 << n) - 1) << 8 - n,
                r |= this[--t] >> (n += this.DB - 8)) : (r = this[t] >> (n -= 8) & 255,
                n <= 0 && (n += this.DB,
                --t)),
                0 != (128 & r) && (r |= -256),
                0 == i && (128 & this.s) != (128 & r) && ++i,
                (i > 0 || r != this.s) && (e[i++] = r);
        return e;
    }
    ,
    t.prototype.equals = function(t) {
        return 0 == this.compareTo(t);
    }
    ,
    t.prototype.min = function(t) {
        return this.compareTo(t) < 0 ? this : t;
    }
    ,
    t.prototype.max = function(t) {
        return this.compareTo(t) > 0 ? this : t;
    }
    ,
    t.prototype.and = function(t) {
        var e = I();
        return this.bitwiseTo(t, i, e),
        e;
    }
    ,
    t.prototype.or = function(t) {
        var e = I();
        return this.bitwiseTo(t, o, e),
        e;
    }
    ,
    t.prototype.xor = function(t) {
        var e = I();
        return this.bitwiseTo(t, s, e),
        e;
    }
    ,
    t.prototype.andNot = function(t) {
        var e = I();
        return this.bitwiseTo(t, a, e),
        e;
    }
    ,
    t.prototype.not = function() {
        for (var t = I(), e = 0; e < this.t; ++e)
            t[e] = this.DM & ~this[e];
        return t.t = this.t,
        t.s = ~this.s,
        t;
    }
    ,
    t.prototype.shiftLeft = function(t) {
        var e = I();
        return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
        e;
    }
    ,
    t.prototype.shiftRight = function(t) {
        var e = I();
        return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
        e;
    }
    ,
    t.prototype.getLowestSetBit = function() {
        for (var t = 0; t < this.t; ++t)
            if (0 != this[t])
                return t * this.DB + c(this[t]);
        return this.s < 0 ? this.t * this.DB : -1;
    }
    ,
    t.prototype.bitCount = function() {
        for (var t = 0, e = this.s & this.DM, r = 0; r < this.t; ++r)
            t += u(this[r] ^ e);
        return t;
    }
    ,
    t.prototype.testBit = function(t) {
        var e = Math.floor(t / this.DB);
        return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB);
    }
    ,
    t.prototype.setBit = function(t) {
        return this.changeBit(t, o);
    }
    ,
    t.prototype.clearBit = function(t) {
        return this.changeBit(t, a);
    }
    ,
    t.prototype.flipBit = function(t) {
        return this.changeBit(t, s);
    }
    ,
    t.prototype.add = function(t) {
        var e = I();
        return this.addTo(t, e),
        e;
    }
    ,
    t.prototype.subtract = function(t) {
        var e = I();
        return this.subTo(t, e),
        e;
    }
    ,
    t.prototype.multiply = function(t) {
        var e = I();
        return this.multiplyTo(t, e),
        e;
    }
    ,
    t.prototype.divide = function(t) {
        var e = I();
        return this.divRemTo(t, e, null),
        e;
    }
    ,
    t.prototype.remainder = function(t) {
        var e = I();
        return this.divRemTo(t, null, e),
        e;
    }
    ,
    t.prototype.divideAndRemainder = function(t) {
        var e = I()
          , r = I();
        return this.divRemTo(t, e, r),
        [e, r];
    }
    ,
    t.prototype.modPow = function(t, e) {
        var r, n, i = t.bitLength(), o = L(1);
        if (i <= 0)
            return o;
        r = i < 18 ? 1 : i < 48 ? 3 : i < 144 ? 4 : i < 768 ? 5 : 6,
        n = i < 8 ? new k(e) : e.isEven() ? new P(e) : new R(e);
        var s = []
          , a = 3
          , c = r - 1
          , u = (1 << r) - 1;
        if (s[1] = n.convert(this),
        r > 1) {
            var h = I();
            for (n.sqrTo(s[1], h); a <= u; )
                s[a] = I(),
                n.mulTo(h, s[a - 2], s[a]),
                a += 2;
        }
        var f, p, l = t.t - 1, y = !0, d = I();
        for (i = F(t[l]) - 1; l >= 0; ) {
            for (i >= c ? f = t[l] >> i - c & u : (f = (t[l] & (1 << i + 1) - 1) << c - i,
            l > 0 && (f |= t[l - 1] >> this.DB + i - c)),
            a = r; 0 == (1 & f); )
                f >>= 1,
                --a;
            if ((i -= a) < 0 && (i += this.DB,
            --l),
            y)
                s[f].copyTo(o),
                y = !1;
            else {
                for (; a > 1; )
                    n.sqrTo(o, d),
                    n.sqrTo(d, o),
                    a -= 2;
                a > 0 ? n.sqrTo(o, d) : (p = o,
                o = d,
                d = p),
                n.mulTo(d, s[f], o);
            }
            for (; l >= 0 && 0 == (t[l] & 1 << i); )
                n.sqrTo(o, d),
                p = o,
                o = d,
                d = p,
                --i < 0 && (i = this.DB - 1,
                --l);
        }
        return n.revert(o);
    }
    ,
    t.prototype.modInverse = function(e) {
        var r = e.isEven();
        if (this.isEven() && r || 0 == e.signum())
            return t.ZERO;
        for (var n = e.clone(), i = this.clone(), o = L(1), s = L(0), a = L(0), c = L(1); 0 != n.signum(); ) {
            for (; n.isEven(); )
                n.rShiftTo(1, n),
                r ? (o.isEven() && s.isEven() || (o.addTo(this, o),
                s.subTo(e, s)),
                o.rShiftTo(1, o)) : s.isEven() || s.subTo(e, s),
                s.rShiftTo(1, s);
            for (; i.isEven(); )
                i.rShiftTo(1, i),
                r ? (a.isEven() && c.isEven() || (a.addTo(this, a),
                c.subTo(e, c)),
                a.rShiftTo(1, a)) : c.isEven() || c.subTo(e, c),
                c.rShiftTo(1, c);
            n.compareTo(i) >= 0 ? (n.subTo(i, n),
            r && o.subTo(a, o),
            s.subTo(c, s)) : (i.subTo(n, i),
            r && a.subTo(o, a),
            c.subTo(s, c));
        }
        return 0 != i.compareTo(t.ONE) ? t.ZERO : c.compareTo(e) >= 0 ? c.subtract(e) : c.signum() < 0 ? (c.addTo(e, c),
        c.signum() < 0 ? c.add(e) : c) : c;
    }
    ,
    t.prototype.pow = function(t) {
        return this.exp(t, new O());
    }
    ,
    t.prototype.gcd = function(t) {
        var e = this.s < 0 ? this.negate() : this.clone()
          , r = t.s < 0 ? t.negate() : t.clone();
        if (e.compareTo(r) < 0) {
            var n = e;
            e = r,
            r = n;
        }
        var i = e.getLowestSetBit()
          , o = r.getLowestSetBit();
        if (o < 0)
            return e;
        for (i < o && (o = i),
        o > 0 && (e.rShiftTo(o, e),
        r.rShiftTo(o, r)); e.signum() > 0; )
            (i = e.getLowestSetBit()) > 0 && e.rShiftTo(i, e),
            (i = r.getLowestSetBit()) > 0 && r.rShiftTo(i, r),
            e.compareTo(r) >= 0 ? (e.subTo(r, e),
            e.rShiftTo(1, e)) : (r.subTo(e, r),
            r.rShiftTo(1, r));
        return o > 0 && r.lShiftTo(o, r),
        r;
    }
    ,
    t.prototype.isProbablePrime = function(t) {
        var e, r = this.abs();
        if (1 == r.t && r[0] <= B[B.length - 1]) {
            for (e = 0; e < B.length; ++e)
                if (r[0] == B[e])
                    return !0;
            return !1;
        }
        if (r.isEven())
            return !1;
        for (e = 1; e < B.length; ) {
            for (var n = B[e], i = e + 1; i < B.length && n < A; )
                n *= B[i++];
            for (n = r.modInt(n); e < i; )
                if (n % B[e++] == 0)
                    return !1;
        }
        return r.millerRabin(t);
    }
    ,
    t.prototype.copyTo = function(t) {
        for (var e = this.t - 1; e >= 0; --e)
            t[e] = this[e];
        t.t = this.t,
        t.s = this.s;
    }
    ,
    t.prototype.fromInt = function(t) {
        this.t = 1,
        this.s = t < 0 ? -1 : 0,
        t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0;
    }
    ,
    t.prototype.fromString = function(e, r) {
        var n;
        if (16 == r)
            n = 4;
        else if (8 == r)
            n = 3;
        else if (256 == r)
            n = 8;
        else if (2 == r)
            n = 1;
        else if (32 == r)
            n = 5;
        else {
            if (4 != r)
                return;
            n = 2;
        }
        this.t = 0,
        this.s = 0;
        for (var i = e.length, o = !1, s = 0; --i >= 0; ) {
            var a = 8 == n ? 255 & +e[i] : N(e, i);
            a < 0 ? "-" == e.charAt(i) && (o = !0) : (o = !1,
            0 == s ? this[this.t++] = a : s + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s,
            this[this.t++] = a >> this.DB - s) : this[this.t - 1] |= a << s,
            (s += n) >= this.DB && (s -= this.DB));
        }
        8 == n && 0 != (128 & +e[0]) && (this.s = -1,
        s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)),
        this.clamp(),
        o && t.ZERO.subTo(this, this);
    }
    ,
    t.prototype.clamp = function() {
        for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
            --this.t;
    }
    ,
    t.prototype.dlShiftTo = function(t, e) {
        var r;
        for (r = this.t - 1; r >= 0; --r)
            e[r + t] = this[r];
        for (r = t - 1; r >= 0; --r)
            e[r] = 0;
        e.t = this.t + t,
        e.s = this.s;
    }
    ,
    t.prototype.drShiftTo = function(t, e) {
        for (var r = t; r < this.t; ++r)
            e[r - t] = this[r];
        e.t = Math.max(this.t - t, 0),
        e.s = this.s;
    }
    ,
    t.prototype.lShiftTo = function(t, e) {
        for (var r = t % this.DB, n = this.DB - r, i = (1 << n) - 1, o = Math.floor(t / this.DB), s = this.s << r & this.DM, a = this.t - 1; a >= 0; --a)
            e[a + o + 1] = this[a] >> n | s,
            s = (this[a] & i) << r;
        for (a = o - 1; a >= 0; --a)
            e[a] = 0;
        e[o] = s,
        e.t = this.t + o + 1,
        e.s = this.s,
        e.clamp();
    }
    ,
    t.prototype.rShiftTo = function(t, e) {
        e.s = this.s;
        var r = Math.floor(t / this.DB);
        if (r >= this.t)
            e.t = 0;
        else {
            var n = t % this.DB
              , i = this.DB - n
              , o = (1 << n) - 1;
            e[0] = this[r] >> n;
            for (var s = r + 1; s < this.t; ++s)
                e[s - r - 1] |= (this[s] & o) << i,
                e[s - r] = this[s] >> n;
            n > 0 && (e[this.t - r - 1] |= (this.s & o) << i),
            e.t = this.t - r,
            e.clamp();
        }
    }
    ,
    t.prototype.subTo = function(t, e) {
        for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i; )
            n += this[r] - t[r],
            e[r++] = n & this.DM,
            n >>= this.DB;
        if (t.t < this.t) {
            for (n -= t.s; r < this.t; )
                n += this[r],
                e[r++] = n & this.DM,
                n >>= this.DB;
            n += this.s;
        } else {
            for (n += this.s; r < t.t; )
                n -= t[r],
                e[r++] = n & this.DM,
                n >>= this.DB;
            n -= t.s;
        }
        e.s = n < 0 ? -1 : 0,
        n < -1 ? e[r++] = this.DV + n : n > 0 && (e[r++] = n),
        e.t = r,
        e.clamp();
    }
    ,
    t.prototype.multiplyTo = function(e, r) {
        var n = this.abs()
          , i = e.abs()
          , o = n.t;
        for (r.t = o + i.t; --o >= 0; )
            r[o] = 0;
        for (o = 0; o < i.t; ++o)
            r[o + n.t] = n.am(0, i[o], r, o, 0, n.t);
        r.s = 0,
        r.clamp(),
        this.s != e.s && t.ZERO.subTo(r, r);
    }
    ,
    t.prototype.squareTo = function(t) {
        for (var e = this.abs(), r = t.t = 2 * e.t; --r >= 0; )
            t[r] = 0;
        for (r = 0; r < e.t - 1; ++r) {
            var n = e.am(r, e[r], t, 2 * r, 0, 1);
            (t[r + e.t] += e.am(r + 1, 2 * e[r], t, 2 * r + 1, n, e.t - r - 1)) >= e.DV && (t[r + e.t] -= e.DV,
            t[r + e.t + 1] = 1);
        }
        t.t > 0 && (t[t.t - 1] += e.am(r, e[r], t, 2 * r, 0, 1)),
        t.s = 0,
        t.clamp();
    }
    ,
    t.prototype.divRemTo = function(e, r, n) {
        var i = e.abs();
        if (!(i.t <= 0)) {
            var o = this.abs();
            if (o.t < i.t)
                return void (null != r && r.fromInt(0));
            null == n && (n = I());
            var s = I()
              , a = this.s
              , c = e.s
              , u = this.DB - F(i[i.t - 1]);
            u > 0 ? (i.lShiftTo(u, s),
            o.lShiftTo(u, n)) : (i.copyTo(s),
            o.copyTo(n));
            var h = s.t
              , f = s[h - 1];
            if (0 != f) {
                var p = f * (1 << this.F1) + (h > 1 ? s[h - 2] >> this.F2 : 0)
                  , l = this.FV / p
                  , y = (1 << this.F1) / p
                  , d = 1 << this.F2
                  , g = n.t
                  , m = g - h
                  , v = null == r ? I() : r;
                for (s.dlShiftTo(m, v),
                n.compareTo(v) >= 0 && (n[n.t++] = 1,
                n.subTo(v, n)),
                t.ONE.dlShiftTo(h, v),
                v.subTo(s, s); s.t < h; )
                    s[s.t++] = 0;
                for (; --m >= 0; ) {
                    var b = n[--g] == f ? this.DM : Math.floor(n[g] * l + (n[g - 1] + d) * y);
                    if ((n[g] += s.am(0, b, n, m, 0, h)) < b)
                        for (s.dlShiftTo(m, v),
                        n.subTo(v, n); n[g] < --b; )
                            n.subTo(v, n);
                }
                null != r && (n.drShiftTo(h, r),
                a != c && t.ZERO.subTo(r, r)),
                n.t = h,
                n.clamp(),
                u > 0 && n.rShiftTo(u, n),
                a < 0 && t.ZERO.subTo(n, n);
            }
        }
    }
    ,
    t.prototype.invDigit = function() {
        if (this.t < 1)
            return 0;
        var t = this[0];
        if (0 == (1 & t))
            return 0;
        var e = 3 & t;
        return (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) > 0 ? this.DV - e : -e;
    }
    ,
    t.prototype.isEven = function() {
        return 0 == (this.t > 0 ? 1 & this[0] : this.s);
    }
    ,
    t.prototype.exp = function(e, r) {
        if (e > 4294967295 || e < 1)
            return t.ONE;
        var n = I()
          , i = I()
          , o = r.convert(this)
          , s = F(e) - 1;
        for (o.copyTo(n); --s >= 0; )
            if (r.sqrTo(n, i),
            (e & 1 << s) > 0)
                r.mulTo(i, o, n);
            else {
                var a = n;
                n = i,
                i = a;
            }
        return r.revert(n);
    }
    ,
    t.prototype.chunkSize = function(t) {
        return Math.floor(Math.LN2 * this.DB / Math.log(t));
    }
    ,
    t.prototype.toRadix = function(t) {
        if (null == t && (t = 10),
        0 == this.signum() || t < 2 || t > 36)
            return "0";
        var e = this.chunkSize(t)
          , r = Math.pow(t, e)
          , n = L(r)
          , i = I()
          , o = I()
          , s = "";
        for (this.divRemTo(n, i, o); i.signum() > 0; )
            s = (r + o.intValue()).toString(t).substr(1) + s,
            i.divRemTo(n, i, o);
        return o.intValue().toString(t) + s;
    }
    ,
    t.prototype.fromRadix = function(e, r) {
        this.fromInt(0),
        null == r && (r = 10);
        for (var n = this.chunkSize(r), i = Math.pow(r, n), o = !1, s = 0, a = 0, c = 0; c < e.length; ++c) {
            var u = N(e, c);
            u < 0 ? "-" == e.charAt(c) && 0 == this.signum() && (o = !0) : (a = r * a + u,
            ++s >= n && (this.dMultiply(i),
            this.dAddOffset(a, 0),
            s = 0,
            a = 0));
        }
        s > 0 && (this.dMultiply(Math.pow(r, s)),
        this.dAddOffset(a, 0)),
        o && t.ZERO.subTo(this, this);
    }
    ,
    t.prototype.fromNumber = function(e, r, n) {
        if ("number" == typeof r)
            if (e < 2)
                this.fromInt(1);
            else
                for (this.fromNumber(e, n),
                this.testBit(e - 1) || this.bitwiseTo(t.ONE.shiftLeft(e - 1), o, this),
                this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(r); )
                    this.dAddOffset(2, 0),
                    this.bitLength() > e && this.subTo(t.ONE.shiftLeft(e - 1), this);
        else {
            var i = []
              , s = 7 & e;
            i.length = 1 + (e >> 3),
            r.nextBytes(i),
            s > 0 ? i[0] &= (1 << s) - 1 : i[0] = 0,
            this.fromString(i, 256);
        }
    }
    ,
    t.prototype.bitwiseTo = function(t, e, r) {
        var n, i, o = Math.min(t.t, this.t);
        for (n = 0; n < o; ++n)
            r[n] = e(this[n], t[n]);
        if (t.t < this.t) {
            for (i = t.s & this.DM,
            n = o; n < this.t; ++n)
                r[n] = e(this[n], i);
            r.t = this.t;
        } else {
            for (i = this.s & this.DM,
            n = o; n < t.t; ++n)
                r[n] = e(i, t[n]);
            r.t = t.t;
        }
        r.s = e(this.s, t.s),
        r.clamp();
    }
    ,
    t.prototype.changeBit = function(e, r) {
        var n = t.ONE.shiftLeft(e);
        return this.bitwiseTo(n, r, n),
        n;
    }
    ,
    t.prototype.addTo = function(t, e) {
        for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i; )
            n += this[r] + t[r],
            e[r++] = n & this.DM,
            n >>= this.DB;
        if (t.t < this.t) {
            for (n += t.s; r < this.t; )
                n += this[r],
                e[r++] = n & this.DM,
                n >>= this.DB;
            n += this.s;
        } else {
            for (n += this.s; r < t.t; )
                n += t[r],
                e[r++] = n & this.DM,
                n >>= this.DB;
            n += t.s;
        }
        e.s = n < 0 ? -1 : 0,
        n > 0 ? e[r++] = n : n < -1 && (e[r++] = this.DV + n),
        e.t = r,
        e.clamp();
    }
    ,
    t.prototype.dMultiply = function(t) {
        this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
        ++this.t,
        this.clamp();
    }
    ,
    t.prototype.dAddOffset = function(t, e) {
        if (0 != t) {
            for (; this.t <= e; )
                this[this.t++] = 0;
            for (this[e] += t; this[e] >= this.DV; )
                this[e] -= this.DV,
                ++e >= this.t && (this[this.t++] = 0),
                ++this[e];
        }
    }
    ,
    t.prototype.multiplyLowerTo = function(t, e, r) {
        var n = Math.min(this.t + t.t, e);
        for (r.s = 0,
        r.t = n; n > 0; )
            r[--n] = 0;
        for (var i = r.t - this.t; n < i; ++n)
            r[n + this.t] = this.am(0, t[n], r, n, 0, this.t);
        for (i = Math.min(t.t, e); n < i; ++n)
            this.am(0, t[n], r, n, 0, e - n);
        r.clamp();
    }
    ,
    t.prototype.multiplyUpperTo = function(t, e, r) {
        --e;
        var n = r.t = this.t + t.t - e;
        for (r.s = 0; --n >= 0; )
            r[n] = 0;
        for (n = Math.max(e - this.t, 0); n < t.t; ++n)
            r[this.t + n - e] = this.am(e - n, t[n], r, 0, 0, this.t + n - e);
        r.clamp(),
        r.drShiftTo(1, r);
    }
    ,
    t.prototype.modInt = function(t) {
        if (t <= 0)
            return 0;
        var e = this.DV % t
          , r = this.s < 0 ? t - 1 : 0;
        if (this.t > 0)
            if (0 == e)
                r = this[0] % t;
            else
                for (var n = this.t - 1; n >= 0; --n)
                    r = (e * r + this[n]) % t;
        return r;
    }
    ,
    t.prototype.millerRabin = function(e) {
        var r = this.subtract(t.ONE)
          , n = r.getLowestSetBit();
        if (n <= 0)
            return !1;
        var i = r.shiftRight(n);
        (e = e + 1 >> 1) > B.length && (e = B.length);
        for (var o = I(), s = 0; s < e; ++s) {
            o.fromInt(B[Math.floor(Math.random() * B.length)]);
            var a = o.modPow(i, this);
            if (0 != a.compareTo(t.ONE) && 0 != a.compareTo(r)) {
                for (var c = 1; c++ < n && 0 != a.compareTo(r); )
                    if (0 == (a = a.modPowInt(2, this)).compareTo(t.ONE))
                        return !1;
                if (0 != a.compareTo(r))
                    return !1;
            }
        }
        return !0;
    }
    ,
    t.prototype.square = function() {
        var t = I();
        return this.squareTo(t),
        t;
    }
    ,
    t.prototype.gcda = function(t, e) {
        var r = this.s < 0 ? this.negate() : this.clone()
          , n = t.s < 0 ? t.negate() : t.clone();
        if (r.compareTo(n) < 0) {
            var i = r;
            r = n,
            n = i;
        }
        var o = r.getLowestSetBit()
          , s = n.getLowestSetBit();
        s < 0 ? e(r) : (o < s && (s = o),
        s > 0 && (r.rShiftTo(s, r),
        n.rShiftTo(s, n)),
        setTimeout(function t() {
            (o = r.getLowestSetBit()) > 0 && r.rShiftTo(o, r),
            (o = n.getLowestSetBit()) > 0 && n.rShiftTo(o, n),
            r.compareTo(n) >= 0 ? (r.subTo(n, r),
            r.rShiftTo(1, r)) : (n.subTo(r, n),
            n.rShiftTo(1, n)),
            r.signum() > 0 ? setTimeout(t, 0) : (s > 0 && n.lShiftTo(s, n),
            setTimeout(function() {
                e(n);
            }, 0));
        }, 10));
    }
    ,
    t.prototype.fromNumberAsync = function(e, r, n, i) {
        if ("number" == typeof r)
            if (e < 2)
                this.fromInt(1);
            else {
                this.fromNumber(e, n),
                this.testBit(e - 1) || this.bitwiseTo(t.ONE.shiftLeft(e - 1), o, this),
                this.isEven() && this.dAddOffset(1, 0);
                var s = this;
                setTimeout(function n() {
                    s.dAddOffset(2, 0),
                    s.bitLength() > e && s.subTo(t.ONE.shiftLeft(e - 1), s),
                    s.isProbablePrime(r) ? setTimeout(function() {
                        i();
                    }, 0) : setTimeout(n, 0);
                }, 0);
            }
        else {
            var a = []
              , c = 7 & e;
            a.length = 1 + (e >> 3),
            r.nextBytes(a),
            c > 0 ? a[0] &= (1 << c) - 1 : a[0] = 0,
            this.fromString(a, 256);
        }
    }
    ,
    t;
}(), O = function() {
    function t() {}
    return t.prototype.convert = function(t) {
        return t;
    }
    ,
    t.prototype.revert = function(t) {
        return t;
    }
    ,
    t.prototype.mulTo = function(t, e, r) {
        t.multiplyTo(e, r);
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e);
    }
    ,
    t;
}(), k = function() {
    function t(t) {
        this.m = t;
    }
    return t.prototype.convert = function(t) {
        return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t;
    }
    ,
    t.prototype.revert = function(t) {
        return t;
    }
    ,
    t.prototype.reduce = function(t) {
        t.divRemTo(this.m, null, t);
    }
    ,
    t.prototype.mulTo = function(t, e, r) {
        t.multiplyTo(e, r),
        this.reduce(r);
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e);
    }
    ,
    t;
}(), R = function() {
    function t(t) {
        this.m = t,
        this.mp = t.invDigit(),
        this.mpl = 32767 & this.mp,
        this.mph = this.mp >> 15,
        this.um = (1 << t.DB - 15) - 1,
        this.mt2 = 2 * t.t;
    }
    return t.prototype.convert = function(t) {
        var e = I();
        return t.abs().dlShiftTo(this.m.t, e),
        e.divRemTo(this.m, null, e),
        t.s < 0 && e.compareTo(D.ZERO) > 0 && this.m.subTo(e, e),
        e;
    }
    ,
    t.prototype.revert = function(t) {
        var e = I();
        return t.copyTo(e),
        this.reduce(e),
        e;
    }
    ,
    t.prototype.reduce = function(t) {
        for (; t.t <= this.mt2; )
            t[t.t++] = 0;
        for (var e = 0; e < this.m.t; ++e) {
            var r = 32767 & t[e]
              , n = r * this.mpl + ((r * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
            for (t[r = e + this.m.t] += this.m.am(0, n, t, e, 0, this.m.t); t[r] >= t.DV; )
                t[r] -= t.DV,
                t[++r]++;
        }
        t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
    }
    ,
    t.prototype.mulTo = function(t, e, r) {
        t.multiplyTo(e, r),
        this.reduce(r);
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e);
    }
    ,
    t;
}(), P = function() {
    function t(t) {
        this.m = t,
        this.r2 = I(),
        this.q3 = I(),
        D.ONE.dlShiftTo(2 * t.t, this.r2),
        this.mu = this.r2.divide(t);
    }
    return t.prototype.convert = function(t) {
        if (t.s < 0 || t.t > 2 * this.m.t)
            return t.mod(this.m);
        if (t.compareTo(this.m) < 0)
            return t;
        var e = I();
        return t.copyTo(e),
        this.reduce(e),
        e;
    }
    ,
    t.prototype.revert = function(t) {
        return t;
    }
    ,
    t.prototype.reduce = function(t) {
        for (t.drShiftTo(this.m.t - 1, this.r2),
        t.t > this.m.t + 1 && (t.t = this.m.t + 1,
        t.clamp()),
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0; )
            t.dAddOffset(1, this.m.t + 1);
        for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; )
            t.subTo(this.m, t);
    }
    ,
    t.prototype.mulTo = function(t, e, r) {
        t.multiplyTo(e, r),
        this.reduce(r);
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e);
    }
    ,
    t;
}();
function I() {
    return new D(null);
}
function C(t, e) {
    return new D(t,e);
}
"Microsoft Internet Explorer" == e.appName ? (D.prototype.am = function(t, e, r, n, i, o) {
    for (var s = 32767 & e, a = e >> 15; --o >= 0; ) {
        var c = 32767 & this[t]
          , u = this[t++] >> 15
          , h = a * c + u * s;
        i = ((c = s * c + ((32767 & h) << 15) + r[n] + (1073741823 & i)) >>> 30) + (h >>> 15) + a * u + (i >>> 30),
        r[n++] = 1073741823 & c;
    }
    return i;
}
,
w = 30) : "Netscape" != e.appName ? (D.prototype.am = function(t, e, r, n, i, o) {
    for (; --o >= 0; ) {
        var s = e * this[t++] + r[n] + i;
        i = Math.floor(s / 67108864),
        r[n++] = 67108863 & s;
    }
    return i;
}
,
w = 26) : (D.prototype.am = function(t, e, r, n, i, o) {
    for (var s = 16383 & e, a = e >> 14; --o >= 0; ) {
        var c = 16383 & this[t]
          , u = this[t++] >> 14
          , h = a * c + u * s;
        i = ((c = s * c + ((16383 & h) << 14) + r[n] + i) >> 28) + (h >> 14) + a * u,
        r[n++] = 268435455 & c;
    }
    return i;
}
,
w = 28),
D.prototype.DB = w,
D.prototype.DM = (1 << w) - 1,
D.prototype.DV = 1 << w,
D.prototype.FV = Math.pow(2, 52),
D.prototype.F1 = 52 - w,
D.prototype.F2 = 2 * w - 52;
var j, M, H = [];
for (j = "0".charCodeAt(0),
M = 0; M <= 9; ++M)
    H[j++] = M;
for (j = "a".charCodeAt(0),
M = 10; M < 36; ++M)
    H[j++] = M;
for (j = "A".charCodeAt(0),
M = 10; M < 36; ++M)
    H[j++] = M;
function N(t, e) {
    var r = H[t.charCodeAt(e)];
    return null == r ? -1 : r;
}
function L(t) {
    var e = I();
    return e.fromInt(t),
    e;
}
function F(t) {
    var e, r = 1;
    return 0 != (e = t >>> 16) && (t = e,
    r += 16),
    0 != (e = t >> 8) && (t = e,
    r += 8),
    0 != (e = t >> 4) && (t = e,
    r += 4),
    0 != (e = t >> 2) && (t = e,
    r += 2),
    0 != (e = t >> 1) && (t = e,
    r += 1),
    r;
}
D.ZERO = L(0),
D.ONE = L(1);
var V, q, $ = function() {
    function t() {
        this.i = 0,
        this.j = 0,
        this.S = [];
    }
    return t.prototype.init = function(t) {
        var e, r, n;
        for (e = 0; e < 256; ++e)
            this.S[e] = e;
        for (r = 0,
        e = 0; e < 256; ++e)
            r = r + this.S[e] + t[e % t.length] & 255,
            n = this.S[e],
            this.S[e] = this.S[r],
            this.S[r] = n;
        this.i = 0,
        this.j = 0;
    }
    ,
    t.prototype.next = function() {
        var t;
        return this.i = this.i + 1 & 255,
        this.j = this.j + this.S[this.i] & 255,
        t = this.S[this.i],
        this.S[this.i] = this.S[this.j],
        this.S[this.j] = t,
        this.S[t + this.S[this.i] & 255];
    }
    ,
    t;
}(), U = null;
if (null == U) {
    U = [],
    q = 0;
    var z = void 0;
    if (r.crypto && r.crypto.getRandomValues) {
        var K = new Uint32Array(256);
        for (r.crypto.getRandomValues(K),
        z = 0; z < K.length; ++z)
            U[q++] = 255 & K[z];
    }
    var W = function t(e) {
        if (this.count = this.count || 0,
        this.count >= 256 || q >= 256)
            r.removeEventListener ? r.removeEventListener("mousemove", t, !1) : r.detachEvent && r.detachEvent("onmousemove", t);
        else
            try {
                var n = e.x + e.y;
                U[q++] = 255 & n,
                this.count += 1;
            } catch (e) {}
    };
    r.addEventListener ? r.addEventListener("mousemove", W, !1) : r.attachEvent && r.attachEvent("onmousemove", W);
}
function Y() {
    if (null == V) {
        for (V = new $(); q < 256; ) {
            var t = Math.floor(65536 * Math.random());
            U[q++] = 255 & t;
        }
        for (V.init(U),
        q = 0; q < U.length; ++q)
            U[q] = 0;
        q = 0;
    }
    return V.next();
}
var X = function() {
    function t() {}
    return t.prototype.nextBytes = function(t) {
        for (var e = 0; e < t.length; ++e)
            t[e] = Y();
    }
    ,
    t;
}()
  , G = function() {
    function t() {
        this.n = null,
        this.e = 0,
        this.d = null,
        this.p = null,
        this.q = null,
        this.dmp1 = null,
        this.dmq1 = null,
        this.coeff = null;
    }
    return t.prototype.doPublic = function(t) {
        return t.modPowInt(this.e, this.n);
    }
    ,
    t.prototype.doPrivate = function(t) {
        if (null == this.p || null == this.q)
            return t.modPow(this.d, this.n);
        for (var e = t.mod(this.p).modPow(this.dmp1, this.p), r = t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(r) < 0; )
            e = e.add(this.p);
        return e.subtract(r).multiply(this.coeff).mod(this.p).multiply(this.q).add(r);
    }
    ,
    t.prototype.setPublic = function(t, e) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = C(t, 16),
        this.e = parseInt(e, 16)) : console.error("Invalid RSA public key");
    }
    ,
    t.prototype.encrypt = function(t) {
        var e = function(t, e) {
            if (e < t.length + 11)
                return console.error("Message too long for RSA"),
                null;
            for (var r = [], n = t.length - 1; n >= 0 && e > 0; ) {
                var i = t.charCodeAt(n--);
                i < 128 ? r[--e] = i : i > 127 && i < 2048 ? (r[--e] = 63 & i | 128,
                r[--e] = i >> 6 | 192) : (r[--e] = 63 & i | 128,
                r[--e] = i >> 6 & 63 | 128,
                r[--e] = i >> 12 | 224);
            }
            r[--e] = 0;
            for (var o = new X(), s = []; e > 2; ) {
                for (s[0] = 0; 0 == s[0]; )
                    o.nextBytes(s);
                r[--e] = s[0];
            }
            return r[--e] = 2,
            r[--e] = 0,
            new D(r);
        }(t, this.n.bitLength() + 7 >> 3);
        if (null == e)
            return null;
        var r = this.doPublic(e);
        if (null == r)
            return null;
        var n = r.toString(16);
        return 0 == (1 & n.length) ? n : "0" + n;
    }
    ,
    t.prototype.setPrivate = function(t, e, r) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = C(t, 16),
        this.e = parseInt(e, 16),
        this.d = C(r, 16)) : console.error("Invalid RSA private key");
    }
    ,
    t.prototype.setPrivateEx = function(t, e, r, n, i, o, s, a) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = C(t, 16),
        this.e = parseInt(e, 16),
        this.d = C(r, 16),
        this.p = C(n, 16),
        this.q = C(i, 16),
        this.dmp1 = C(o, 16),
        this.dmq1 = C(s, 16),
        this.coeff = C(a, 16)) : console.error("Invalid RSA private key");
    }
    ,
    t.prototype.generate = function(t, e) {
        var r = new X()
          , n = t >> 1;
        this.e = parseInt(e, 16);
        for (var i = new D(e,16); ; ) {
            for (; this.p = new D(t - n,1,r),
            0 != this.p.subtract(D.ONE).gcd(i).compareTo(D.ONE) || !this.p.isProbablePrime(10); )
                ;
            for (; this.q = new D(n,1,r),
            0 != this.q.subtract(D.ONE).gcd(i).compareTo(D.ONE) || !this.q.isProbablePrime(10); )
                ;
            if (this.p.compareTo(this.q) <= 0) {
                var o = this.p;
                this.p = this.q,
                this.q = o;
            }
            var s = this.p.subtract(D.ONE)
              , a = this.q.subtract(D.ONE)
              , c = s.multiply(a);
            if (0 == c.gcd(i).compareTo(D.ONE)) {
                this.n = this.p.multiply(this.q),
                this.d = i.modInverse(c),
                this.dmp1 = this.d.mod(s),
                this.dmq1 = this.d.mod(a),
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    }
    ,
    t.prototype.decrypt = function(t) {
        var e = C(t, 16)
          , r = this.doPrivate(e);
        return null == r ? null : function(t, e) {
            for (var r = t.toByteArray(), n = 0; n < r.length && 0 == r[n]; )
                ++n;
            if (r.length - n != e - 1 || 2 != r[n])
                return null;
            for (++n; 0 != r[n]; )
                if (++n >= r.length)
                    return null;
            for (var i = ""; ++n < r.length; ) {
                var o = 255 & r[n];
                o < 128 ? i += String.fromCharCode(o) : o > 191 && o < 224 ? (i += String.fromCharCode((31 & o) << 6 | 63 & r[n + 1]),
                ++n) : (i += String.fromCharCode((15 & o) << 12 | (63 & r[n + 1]) << 6 | 63 & r[n + 2]),
                n += 2);
            }
            return i;
        }(r, this.n.bitLength() + 7 >> 3);
    }
    ,
    t.prototype.generateAsync = function(t, e, r) {
        var n = new X()
          , i = t >> 1;
        this.e = parseInt(e, 16);
        var o = new D(e,16)
          , s = this;
        setTimeout(function e() {
            var a = function() {
                if (s.p.compareTo(s.q) <= 0) {
                    var t = s.p;
                    s.p = s.q,
                    s.q = t;
                }
                var n = s.p.subtract(D.ONE)
                  , i = s.q.subtract(D.ONE)
                  , a = n.multiply(i);
                0 == a.gcd(o).compareTo(D.ONE) ? (s.n = s.p.multiply(s.q),
                s.d = o.modInverse(a),
                s.dmp1 = s.d.mod(n),
                s.dmq1 = s.d.mod(i),
                s.coeff = s.q.modInverse(s.p),
                setTimeout(function() {
                    r();
                }, 0)) : setTimeout(e, 0);
            }
              , c = function t() {
                s.q = I(),
                s.q.fromNumberAsync(i, 1, n, function() {
                    s.q.subtract(D.ONE).gcda(o, function(e) {
                        0 == e.compareTo(D.ONE) && s.q.isProbablePrime(10) ? setTimeout(a, 0) : setTimeout(t, 0);
                    });
                });
            };
            setTimeout(function e() {
                s.p = I(),
                s.p.fromNumberAsync(t - i, 1, n, function() {
                    s.p.subtract(D.ONE).gcda(o, function(t) {
                        0 == t.compareTo(D.ONE) && s.p.isProbablePrime(10) ? setTimeout(c, 0) : setTimeout(e, 0);
                    });
                });
            }, 0);
        }, 0);
    }
    ,
    t.prototype.sign = function(t, e, r) {
        var n = function(t, e) {
            if (e < t.length + 22)
                return console.error("Message too long for RSA"),
                null;
            for (var r = e - t.length - 6, n = "", i = 0; i < r; i += 2)
                n += "ff";
            return C("0001" + n + "00" + t, 16);
        }((Q[r] || "") + e(t).toString(), this.n.bitLength() / 4);
        if (null == n)
            return null;
        var i = this.doPrivate(n);
        if (null == i)
            return null;
        var o = i.toString(16);
        return 0 == (1 & o.length) ? o : "0" + o;
    }
    ,
    t.prototype.verify = function(t, e, r) {
        var n = C(e, 16)
          , i = this.doPublic(n);
        return null == i ? null : function(t) {
            for (var e in Q)
                if (Q.hasOwnProperty(e)) {
                    var r = Q[e]
                      , n = r.length;
                    if (t.substr(0, n) == r)
                        return t.substr(n);
                }
            return t;
        }(i.toString(16).replace(/^1f+00/, "")) == r(t).toString();
    }
    ,
    t;
}()
  , Q = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414"
}
  , Z = {};
Z.lang = {
    extend: function(t, r, n) {
        if (!r || !t)
            throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
        var i = function() {};
        if (i.prototype = r.prototype,
        t.prototype = new i(),
        t.prototype.constructor = t,
        t.superclass = r.prototype,
        r.prototype.constructor == Object.prototype.constructor && (r.prototype.constructor = r),
        n) {
            var o;
            for (o in n)
                t.prototype[o] = n[o];
            var s = function() {}
              , a = ["toString", "valueOf"];
            try {
                /MSIE/.test(e.userAgent) && (s = function(t, e) {
                    for (o = 0; o < a.length; o += 1) {
                        var r = a[o]
                          , n = e[r];
                        "function" == typeof n && n != Object.prototype[r] && (t[r] = n);
                    }
                }
                );
            } catch (t) {}
            s(t.prototype, n);
        }
    }
};
var J = {};
void 0 !== J.asn1 && J.asn1 || (J.asn1 = {}),
J.asn1.ASN1Util = new function() {
    this.integerToByteHex = function(t) {
        var e = t.toString(16);
        return e.length % 2 == 1 && (e = "0" + e),
        e;
    }
    ,
    this.bigIntToMinTwosComplementsHex = function(t) {
        var e = t.toString(16);
        if ("-" != e.substr(0, 1))
            e.length % 2 == 1 ? e = "0" + e : e.match(/^[0-7]/) || (e = "00" + e);
        else {
            var r = e.substr(1).length;
            r % 2 == 1 ? r += 1 : e.match(/^[0-7]/) || (r += 2);
            for (var n = "", i = 0; i < r; i++)
                n += "f";
            e = new D(n,16).xor(t).add(D.ONE).toString(16).replace(/^-/, "");
        }
        return e;
    }
    ,
    this.getPEMStringFromHex = function(t, e) {
        return hextopem(t, e);
    }
    ,
    this.newObject = function(t) {
        var e = J.asn1
          , r = e.DERBoolean
          , n = e.DERInteger
          , i = e.DERBitString
          , o = e.DEROctetString
          , s = e.DERNull
          , a = e.DERObjectIdentifier
          , c = e.DEREnumerated
          , u = e.DERUTF8String
          , h = e.DERNumericString
          , f = e.DERPrintableString
          , p = e.DERTeletexString
          , l = e.DERIA5String
          , y = e.DERUTCTime
          , d = e.DERGeneralizedTime
          , g = e.DERSequence
          , m = e.DERSet
          , v = e.DERTaggedObject
          , b = e.ASN1Util.newObject
          , S = Object.keys(t);
        if (1 != S.length)
            throw "key of param shall be only one.";
        var _ = S[0];
        if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + _ + ":"))
            throw "undefined key: " + _;
        if ("bool" == _)
            return new r(t[_]);
        if ("int" == _)
            return new n(t[_]);
        if ("bitstr" == _)
            return new i(t[_]);
        if ("octstr" == _)
            return new o(t[_]);
        if ("null" == _)
            return new s(t[_]);
        if ("oid" == _)
            return new a(t[_]);
        if ("enum" == _)
            return new c(t[_]);
        if ("utf8str" == _)
            return new u(t[_]);
        if ("numstr" == _)
            return new h(t[_]);
        if ("prnstr" == _)
            return new f(t[_]);
        if ("telstr" == _)
            return new p(t[_]);
        if ("ia5str" == _)
            return new l(t[_]);
        if ("utctime" == _)
            return new y(t[_]);
        if ("gentime" == _)
            return new d(t[_]);
        if ("seq" == _) {
            for (var w = t[_], x = [], T = 0; T < w.length; T++) {
                var E = b(w[T]);
                x.push(E);
            }
            return new g({
                array: x
            });
        }
        if ("set" == _) {
            for (w = t[_],
            x = [],
            T = 0; T < w.length; T++)
                E = b(w[T]),
                x.push(E);
            return new m({
                array: x
            });
        }
        if ("tag" == _) {
            var B = t[_];
            if ("[object Array]" === Object.prototype.toString.call(B) && 3 == B.length) {
                var A = b(B[2]);
                return new v({
                    tag: B[0],
                    explicit: B[1],
                    obj: A
                });
            }
            var D = {};
            if (void 0 !== B.explicit && (D.explicit = B.explicit),
            void 0 !== B.tag && (D.tag = B.tag),
            void 0 === B.obj)
                throw "obj shall be specified for 'tag'.";
            return D.obj = b(B.obj),
            new v(D);
        }
    }
    ,
    this.jsonToASN1HEX = function(t) {
        return this.newObject(t).getEncodedHex();
    }
    ;
}
(),
J.asn1.ASN1Util.oidHexToInt = function(t) {
    for (var e = "", r = parseInt(t.substr(0, 2), 16), n = (e = Math.floor(r / 40) + "." + r % 40,
    ""), i = 2; i < t.length; i += 2) {
        var o = ("00000000" + parseInt(t.substr(i, 2), 16).toString(2)).slice(-8);
        n += o.substr(1, 7),
        "0" == o.substr(0, 1) && (e = e + "." + new D(n,2).toString(10),
        n = "");
    }
    return e;
}
,
J.asn1.ASN1Util.oidIntToHex = function(t) {
    var e = function(t) {
        var e = t.toString(16);
        return 1 == e.length && (e = "0" + e),
        e;
    }
      , r = function(t) {
        var r = ""
          , n = new D(t,10).toString(2)
          , i = 7 - n.length % 7;
        7 == i && (i = 0);
        for (var o = "", s = 0; s < i; s++)
            o += "0";
        for (n = o + n,
        s = 0; s < n.length - 1; s += 7) {
            var a = n.substr(s, 7);
            s != n.length - 7 && (a = "1" + a),
            r += e(parseInt(a, 2));
        }
        return r;
    };
    if (!t.match(/^[0-9.]+$/))
        throw "malformed oid string: " + t;
    var n = ""
      , i = t.split(".")
      , o = 40 * parseInt(i[0]) + parseInt(i[1]);
    n += e(o),
    i.splice(0, 2);
    for (var s = 0; s < i.length; s++)
        n += r(i[s]);
    return n;
}
,
J.asn1.ASN1Object = function() {
    this.getLengthHexFromValue = function() {
        if (void 0 === this.hV || null == this.hV)
            throw "this.hV is null or undefined.";
        if (this.hV.length % 2 == 1)
            throw "value hex must be even length: n=0,v=" + this.hV;
        var t = this.hV.length / 2
          , e = t.toString(16);
        if (e.length % 2 == 1 && (e = "0" + e),
        t < 128)
            return e;
        var r = e.length / 2;
        if (r > 15)
            throw "ASN.1 length too long to represent by 8x: n = " + t.toString(16);
        return (128 + r).toString(16) + e;
    }
    ,
    this.getEncodedHex = function() {
        return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(),
        this.hL = this.getLengthHexFromValue(),
        this.hTLV = this.hT + this.hL + this.hV,
        this.isModified = !1),
        this.hTLV;
    }
    ,
    this.getValueHex = function() {
        return this.getEncodedHex(),
        this.hV;
    }
    ,
    this.getFreshValueHex = function() {
        return "";
    }
    ;
}
,
J.asn1.DERAbstractString = function(t) {
    J.asn1.DERAbstractString.superclass.constructor.call(this),
    this.getString = function() {
        return this.s;
    }
    ,
    this.setString = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = t,
        this.hV = stohex(this.s);
    }
    ,
    this.setStringHex = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = t;
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && ("string" == typeof t ? this.setString(t) : void 0 !== t.str ? this.setString(t.str) : void 0 !== t.hex && this.setStringHex(t.hex));
}
,
Z.lang.extend(J.asn1.DERAbstractString, J.asn1.ASN1Object),
J.asn1.DERAbstractTime = function(t) {
    J.asn1.DERAbstractTime.superclass.constructor.call(this),
    this.localDateToUTC = function(t) {
        return utc = t.getTime() + 6e4 * t.getTimezoneOffset(),
        new Date(utc);
    }
    ,
    this.formatDate = function(t, e, r) {
        var n = this.zeroPadding
          , i = this.localDateToUTC(t)
          , o = String(i.getFullYear());
        "utc" == e && (o = o.substr(2, 2));
        var s = o + n(String(i.getMonth() + 1), 2) + n(String(i.getDate()), 2) + n(String(i.getHours()), 2) + n(String(i.getMinutes()), 2) + n(String(i.getSeconds()), 2);
        if (!0 === r) {
            var a = i.getMilliseconds();
            if (0 != a) {
                var c = n(String(a), 3);
                s = s + "." + (c = c.replace(/[0]+$/, ""));
            }
        }
        return s + "Z";
    }
    ,
    this.zeroPadding = function(t, e) {
        return t.length >= e ? t : new Array(e - t.length + 1).join("0") + t;
    }
    ,
    this.getString = function() {
        return this.s;
    }
    ,
    this.setString = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = t,
        this.hV = stohex(t);
    }
    ,
    this.setByDateValue = function(t, e, r, n, i, o) {
        var s = new Date(Date.UTC(t, e - 1, r, n, i, o, 0));
        this.setByDate(s);
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ;
}
,
Z.lang.extend(J.asn1.DERAbstractTime, J.asn1.ASN1Object),
J.asn1.DERAbstractStructured = function(t) {
    J.asn1.DERAbstractString.superclass.constructor.call(this),
    this.setByASN1ObjectArray = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.asn1Array = t;
    }
    ,
    this.appendASN1Object = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.asn1Array.push(t);
    }
    ,
    this.asn1Array = new Array(),
    void 0 !== t && void 0 !== t.array && (this.asn1Array = t.array);
}
,
Z.lang.extend(J.asn1.DERAbstractStructured, J.asn1.ASN1Object),
J.asn1.DERBoolean = function() {
    J.asn1.DERBoolean.superclass.constructor.call(this),
    this.hT = "01",
    this.hTLV = "0101ff";
}
,
Z.lang.extend(J.asn1.DERBoolean, J.asn1.ASN1Object),
J.asn1.DERInteger = function(t) {
    J.asn1.DERInteger.superclass.constructor.call(this),
    this.hT = "02",
    this.setByBigInteger = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = J.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t);
    }
    ,
    this.setByInteger = function(t) {
        var e = new D(String(t),10);
        this.setByBigInteger(e);
    }
    ,
    this.setValueHex = function(t) {
        this.hV = t;
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && (void 0 !== t.bigint ? this.setByBigInteger(t.bigint) : void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex));
}
,
Z.lang.extend(J.asn1.DERInteger, J.asn1.ASN1Object),
J.asn1.DERBitString = function(t) {
    if (void 0 !== t && void 0 !== t.obj) {
        var e = J.asn1.ASN1Util.newObject(t.obj);
        t.hex = "00" + e.getEncodedHex();
    }
    J.asn1.DERBitString.superclass.constructor.call(this),
    this.hT = "03",
    this.setHexValueIncludingUnusedBits = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = t;
    }
    ,
    this.setUnusedBitsAndHexValue = function(t, e) {
        if (t < 0 || 7 < t)
            throw "unused bits shall be from 0 to 7: u = " + t;
        var r = "0" + t;
        this.hTLV = null,
        this.isModified = !0,
        this.hV = r + e;
    }
    ,
    this.setByBinaryString = function(t) {
        var e = 8 - (t = t.replace(/0+$/, "")).length % 8;
        8 == e && (e = 0);
        for (var r = 0; r <= e; r++)
            t += "0";
        var n = "";
        for (r = 0; r < t.length - 1; r += 8) {
            var i = t.substr(r, 8)
              , o = parseInt(i, 2).toString(16);
            1 == o.length && (o = "0" + o),
            n += o;
        }
        this.hTLV = null,
        this.isModified = !0,
        this.hV = "0" + e + n;
    }
    ,
    this.setByBooleanArray = function(t) {
        for (var e = "", r = 0; r < t.length; r++)
            1 == t[r] ? e += "1" : e += "0";
        this.setByBinaryString(e);
    }
    ,
    this.newFalseArray = function(t) {
        for (var e = new Array(t), r = 0; r < t; r++)
            e[r] = !1;
        return e;
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && ("string" == typeof t && t.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(t) : void 0 !== t.hex ? this.setHexValueIncludingUnusedBits(t.hex) : void 0 !== t.bin ? this.setByBinaryString(t.bin) : void 0 !== t.array && this.setByBooleanArray(t.array));
}
,
Z.lang.extend(J.asn1.DERBitString, J.asn1.ASN1Object),
J.asn1.DEROctetString = function(t) {
    if (void 0 !== t && void 0 !== t.obj) {
        var e = J.asn1.ASN1Util.newObject(t.obj);
        t.hex = e.getEncodedHex();
    }
    J.asn1.DEROctetString.superclass.constructor.call(this, t),
    this.hT = "04";
}
,
Z.lang.extend(J.asn1.DEROctetString, J.asn1.DERAbstractString),
J.asn1.DERNull = function() {
    J.asn1.DERNull.superclass.constructor.call(this),
    this.hT = "05",
    this.hTLV = "0500";
}
,
Z.lang.extend(J.asn1.DERNull, J.asn1.ASN1Object),
J.asn1.DERObjectIdentifier = function(t) {
    var e = function(t) {
        var e = t.toString(16);
        return 1 == e.length && (e = "0" + e),
        e;
    }
      , r = function(t) {
        var r = ""
          , n = new D(t,10).toString(2)
          , i = 7 - n.length % 7;
        7 == i && (i = 0);
        for (var o = "", s = 0; s < i; s++)
            o += "0";
        for (n = o + n,
        s = 0; s < n.length - 1; s += 7) {
            var a = n.substr(s, 7);
            s != n.length - 7 && (a = "1" + a),
            r += e(parseInt(a, 2));
        }
        return r;
    };
    J.asn1.DERObjectIdentifier.superclass.constructor.call(this),
    this.hT = "06",
    this.setValueHex = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = t;
    }
    ,
    this.setValueOidString = function(t) {
        if (!t.match(/^[0-9.]+$/))
            throw "malformed oid string: " + t;
        var n = ""
          , i = t.split(".")
          , o = 40 * parseInt(i[0]) + parseInt(i[1]);
        n += e(o),
        i.splice(0, 2);
        for (var s = 0; s < i.length; s++)
            n += r(i[s]);
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = n;
    }
    ,
    this.setValueName = function(t) {
        var e = J.asn1.x509.OID.name2oid(t);
        if ("" === e)
            throw "DERObjectIdentifier oidName undefined: " + t;
        this.setValueOidString(e);
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && ("string" == typeof t ? t.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(t) : this.setValueName(t) : void 0 !== t.oid ? this.setValueOidString(t.oid) : void 0 !== t.hex ? this.setValueHex(t.hex) : void 0 !== t.name && this.setValueName(t.name));
}
,
Z.lang.extend(J.asn1.DERObjectIdentifier, J.asn1.ASN1Object),
J.asn1.DEREnumerated = function(t) {
    J.asn1.DEREnumerated.superclass.constructor.call(this),
    this.hT = "0a",
    this.setByBigInteger = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = J.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t);
    }
    ,
    this.setByInteger = function(t) {
        var e = new D(String(t),10);
        this.setByBigInteger(e);
    }
    ,
    this.setValueHex = function(t) {
        this.hV = t;
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && (void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex));
}
,
Z.lang.extend(J.asn1.DEREnumerated, J.asn1.ASN1Object),
J.asn1.DERUTF8String = function(t) {
    J.asn1.DERUTF8String.superclass.constructor.call(this, t),
    this.hT = "0c";
}
,
Z.lang.extend(J.asn1.DERUTF8String, J.asn1.DERAbstractString),
J.asn1.DERNumericString = function(t) {
    J.asn1.DERNumericString.superclass.constructor.call(this, t),
    this.hT = "12";
}
,
Z.lang.extend(J.asn1.DERNumericString, J.asn1.DERAbstractString),
J.asn1.DERPrintableString = function(t) {
    J.asn1.DERPrintableString.superclass.constructor.call(this, t),
    this.hT = "13";
}
,
Z.lang.extend(J.asn1.DERPrintableString, J.asn1.DERAbstractString),
J.asn1.DERTeletexString = function(t) {
    J.asn1.DERTeletexString.superclass.constructor.call(this, t),
    this.hT = "14";
}
,
Z.lang.extend(J.asn1.DERTeletexString, J.asn1.DERAbstractString),
J.asn1.DERIA5String = function(t) {
    J.asn1.DERIA5String.superclass.constructor.call(this, t),
    this.hT = "16";
}
,
Z.lang.extend(J.asn1.DERIA5String, J.asn1.DERAbstractString),
J.asn1.DERUTCTime = function(t) {
    J.asn1.DERUTCTime.superclass.constructor.call(this, t),
    this.hT = "17",
    this.setByDate = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.date = t,
        this.s = this.formatDate(this.date, "utc"),
        this.hV = stohex(this.s);
    }
    ,
    this.getFreshValueHex = function() {
        return void 0 === this.date && void 0 === this.s && (this.date = new Date(),
        this.s = this.formatDate(this.date, "utc"),
        this.hV = stohex(this.s)),
        this.hV;
    }
    ,
    void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{12}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date));
}
,
Z.lang.extend(J.asn1.DERUTCTime, J.asn1.DERAbstractTime),
J.asn1.DERGeneralizedTime = function(t) {
    J.asn1.DERGeneralizedTime.superclass.constructor.call(this, t),
    this.hT = "18",
    this.withMillis = !1,
    this.setByDate = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.date = t,
        this.s = this.formatDate(this.date, "gen", this.withMillis),
        this.hV = stohex(this.s);
    }
    ,
    this.getFreshValueHex = function() {
        return void 0 === this.date && void 0 === this.s && (this.date = new Date(),
        this.s = this.formatDate(this.date, "gen", this.withMillis),
        this.hV = stohex(this.s)),
        this.hV;
    }
    ,
    void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{14}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date),
    !0 === t.millis && (this.withMillis = !0));
}
,
Z.lang.extend(J.asn1.DERGeneralizedTime, J.asn1.DERAbstractTime),
J.asn1.DERSequence = function(t) {
    J.asn1.DERSequence.superclass.constructor.call(this, t),
    this.hT = "30",
    this.getFreshValueHex = function() {
        for (var t = "", e = 0; e < this.asn1Array.length; e++)
            t += this.asn1Array[e].getEncodedHex();
        return this.hV = t,
        this.hV;
    }
    ;
}
,
Z.lang.extend(J.asn1.DERSequence, J.asn1.DERAbstractStructured),
J.asn1.DERSet = function(t) {
    J.asn1.DERSet.superclass.constructor.call(this, t),
    this.hT = "31",
    this.sortFlag = !0,
    this.getFreshValueHex = function() {
        for (var t = new Array(), e = 0; e < this.asn1Array.length; e++) {
            var r = this.asn1Array[e];
            t.push(r.getEncodedHex());
        }
        return 1 == this.sortFlag && t.sort(),
        this.hV = t.join(""),
        this.hV;
    }
    ,
    void 0 !== t && void 0 !== t.sortflag && 0 == t.sortflag && (this.sortFlag = !1);
}
,
Z.lang.extend(J.asn1.DERSet, J.asn1.DERAbstractStructured),
J.asn1.DERTaggedObject = function(t) {
    J.asn1.DERTaggedObject.superclass.constructor.call(this),
    this.hT = "a0",
    this.hV = "",
    this.isExplicit = !0,
    this.asn1Object = null,
    this.setASN1Object = function(t, e, r) {
        this.hT = e,
        this.isExplicit = t,
        this.asn1Object = r,
        this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(),
        this.hTLV = null,
        this.isModified = !0) : (this.hV = null,
        this.hTLV = r.getEncodedHex(),
        this.hTLV = this.hTLV.replace(/^../, e),
        this.isModified = !1);
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV;
    }
    ,
    void 0 !== t && (void 0 !== t.tag && (this.hT = t.tag),
    void 0 !== t.explicit && (this.isExplicit = t.explicit),
    void 0 !== t.obj && (this.asn1Object = t.obj,
    this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)));
}
,
Z.lang.extend(J.asn1.DERTaggedObject, J.asn1.ASN1Object);
var tt = function(t) {
    function e(r) {
        var n = t.call(this) || this;
        return r && ("string" == typeof r ? n.parseKey(r) : (e.hasPrivateKeyProperty(r) || e.hasPublicKeyProperty(r)) && n.parsePropertiesFrom(r)),
        n;
    }
    return function(t, e) {
        function r() {
            this.constructor = t;
        }
        d(t, e),
        t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype,
        new r());
    }(e, t),
    e.prototype.parseKey = function(t) {
        try {
            var e = 0
              , r = 0
              , n = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(t) ? function(t) {
                var e;
                if (void 0 === l) {
                    var r = "0123456789ABCDEF"
                      , n = " \f\n\r\t?\u2028\u2029";
                    for (l = {},
                    e = 0; e < 16; ++e)
                        l[r.charAt(e)] = e;
                    for (r = r.toLowerCase(),
                    e = 10; e < 16; ++e)
                        l[r.charAt(e)] = e;
                    for (e = 0; e < n.length; ++e)
                        l[n.charAt(e)] = -1;
                }
                var i = []
                  , o = 0
                  , s = 0;
                for (e = 0; e < t.length; ++e) {
                    var a = t.charAt(e);
                    if ("=" == a)
                        break;
                    if (-1 != (a = l[a])) {
                        if (void 0 === a)
                            throw new Error("Illegal character at offset " + e);
                        o |= a,
                        ++s >= 2 ? (i[i.length] = o,
                        o = 0,
                        s = 0) : o <<= 4;
                    }
                }
                if (s)
                    throw new Error("Hex encoding incomplete: 4 bits missing");
                return i;
            }(t) : g.unarmor(t)
              , i = T.decode(n);
            if (3 === i.sub.length && (i = i.sub[2].sub[0]),
            9 === i.sub.length) {
                e = i.sub[1].getHexStringValue(),
                this.n = C(e, 16),
                r = i.sub[2].getHexStringValue(),
                this.e = parseInt(r, 16);
                var o = i.sub[3].getHexStringValue();
                this.d = C(o, 16);
                var s = i.sub[4].getHexStringValue();
                this.p = C(s, 16);
                var a = i.sub[5].getHexStringValue();
                this.q = C(a, 16);
                var c = i.sub[6].getHexStringValue();
                this.dmp1 = C(c, 16);
                var u = i.sub[7].getHexStringValue();
                this.dmq1 = C(u, 16);
                var h = i.sub[8].getHexStringValue();
                this.coeff = C(h, 16);
            } else {
                if (2 !== i.sub.length)
                    return !1;
                var f = i.sub[1].sub[0];
                e = f.sub[0].getHexStringValue(),
                this.n = C(e, 16),
                r = f.sub[1].getHexStringValue(),
                this.e = parseInt(r, 16);
            }
            return !0;
        } catch (t) {
            return !1;
        }
    }
    ,
    e.prototype.getPrivateBaseKey = function() {
        var t = {
            array: [new J.asn1.DERInteger({
                int: 0
            }), new J.asn1.DERInteger({
                bigint: this.n
            }), new J.asn1.DERInteger({
                int: this.e
            }), new J.asn1.DERInteger({
                bigint: this.d
            }), new J.asn1.DERInteger({
                bigint: this.p
            }), new J.asn1.DERInteger({
                bigint: this.q
            }), new J.asn1.DERInteger({
                bigint: this.dmp1
            }), new J.asn1.DERInteger({
                bigint: this.dmq1
            }), new J.asn1.DERInteger({
                bigint: this.coeff
            })]
        };
        return new J.asn1.DERSequence(t).getEncodedHex();
    }
    ,
    e.prototype.getPrivateBaseKeyB64 = function() {
        return f(this.getPrivateBaseKey());
    }
    ,
    e.prototype.getPublicBaseKey = function() {
        var t = new J.asn1.DERSequence({
            array: [new J.asn1.DERObjectIdentifier({
                oid: "1.2.840.113549.1.1.1"
            }), new J.asn1.DERNull()]
        })
          , e = new J.asn1.DERSequence({
            array: [new J.asn1.DERInteger({
                bigint: this.n
            }), new J.asn1.DERInteger({
                int: this.e
            })]
        })
          , r = new J.asn1.DERBitString({
            hex: "00" + e.getEncodedHex()
        });
        return new J.asn1.DERSequence({
            array: [t, r]
        }).getEncodedHex();
    }
    ,
    e.prototype.getPublicBaseKeyB64 = function() {
        return f(this.getPublicBaseKey());
    }
    ,
    e.wordwrap = function(t, e) {
        if (!t)
            return t;
        var r = "(.{1," + (e = e || 64) + "})( +|$\n?)|(.{1," + e + "})";
        return t.match(RegExp(r, "g")).join("\n");
    }
    ,
    e.prototype.getPrivateKey = function() {
        var t = "-----BEGIN RSA PRIVATE KEY-----\n";
        return (t += e.wordwrap(this.getPrivateBaseKeyB64()) + "\n") + "-----END RSA PRIVATE KEY-----";
    }
    ,
    e.prototype.getPublicKey = function() {
        var t = "-----BEGIN PUBLIC KEY-----\n";
        return (t += e.wordwrap(this.getPublicBaseKeyB64()) + "\n") + "-----END PUBLIC KEY-----";
    }
    ,
    e.hasPublicKeyProperty = function(t) {
        return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e");
    }
    ,
    e.hasPrivateKeyProperty = function(t) {
        return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e") && t.hasOwnProperty("d") && t.hasOwnProperty("p") && t.hasOwnProperty("q") && t.hasOwnProperty("dmp1") && t.hasOwnProperty("dmq1") && t.hasOwnProperty("coeff");
    }
    ,
    e.prototype.parsePropertiesFrom = function(t) {
        this.n = t.n,
        this.e = t.e,
        t.hasOwnProperty("d") && (this.d = t.d,
        this.p = t.p,
        this.q = t.q,
        this.dmp1 = t.dmp1,
        this.dmq1 = t.dmq1,
        this.coeff = t.coeff);
    }
    ,
    e;
}(G)
  , et = function() {
    function t(t) {
        t = t || {},
        this.default_key_size = parseInt(t.default_key_size, 10) || 1024,
        this.default_public_exponent = t.default_public_exponent || "010001",
        this.log = t.log || !1,
        this.key = null;
    }
    return t.prototype.setKey = function(t) {
        this.log && this.key && console.warn("A key was already set, overriding existing."),
        this.key = new tt(t);
    }
    ,
    t.prototype.setPrivateKey = function(t) {
        this.setKey(t);
    }
    ,
    t.prototype.setPublicKey = function(t) {
        this.setKey(t);
    }
    ,
    t.prototype.decrypt = function(t) {
        try {
            return this.getKey().decrypt(p(t));
        } catch (t) {
            return !1;
        }
    }
    ,
    t.prototype.encrypt = function(t) {
        try {
            return f(this.getKey().encrypt(t));
        } catch (t) {
            return !1;
        }
    }
    ,
    t.prototype.sign = function(t, e, r) {
        try {
            return f(this.getKey().sign(t, e, r));
        } catch (t) {
            return !1;
        }
    }
    ,
    t.prototype.verify = function(t, e, r) {
        try {
            return this.getKey().verify(t, p(e), r);
        } catch (t) {
            return !1;
        }
    }
    ,
    t.prototype.getKey = function(t) {
        if (!this.key) {
            if (this.key = new tt(),
            t && "[object Function]" === {}.toString.call(t))
                return;
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    }
    ,
    t.prototype.getPrivateKey = function() {
        return this.getKey().getPrivateKey();
    }
    ,
    t.prototype.getPrivateKeyB64 = function() {
        return this.getKey().getPrivateBaseKeyB64();
    }
    ,
    t.prototype.getPublicKey = function() {
        return this.getKey().getPublicKey();
    }
    ,
    t.prototype.getPublicKeyB64 = function() {
        return this.getKey().getPublicBaseKeyB64();
    }
    ,
    G.prototype.encryptLongBase = function(t, e) {
        e = e || 0;
        var r = ""
          , n = (this.n.bitLength() + 7 >> 3) - 11;
        if (t.length > n) {
            var i = t.match(new RegExp(".{1," + Math.floor(n / 3) + "}","g"))
              , o = this;
            i.forEach(function(t) {
                r += o.encrypt(t);
            });
        } else
            r = this.encrypt(t);
        try {
            r = f(r);
        } catch (t) {
            return !1;
        }
        if (this.d) {
            var s = r || "";
            if (t !== (this.decryptLongBase(s) || ""))
                return e += 1,
                console.log("重新加密次数", e),
                e >= 10 ? r : this.encryptLongBase(t, e);
        }
        return r;
    }
    ,
    G.prototype.decryptLongBase = function(t) {
        var e = ""
          , r = this.n.bitLength() + 7 >> 3
          , n = p(t);
        if (n.length > r) {
            var i = n.match(new RegExp(".{1," + 2 * r + "}","g"))
              , o = this;
            i.forEach(function(t) {
                e += o.decrypt(t);
            });
        } else
            e = this.decrypt(n);
        return e;
    }
    ,
    t.prototype.encryptLong = function(t) {
        try {
            return this.getKey().encryptLongBase(t);
        } catch (t) {
            return !1;
        }
    }
    ,
    t.prototype.decryptLong = function(t) {
        try {
            return this.getKey().decryptLongBase(t);
        } catch (t) {
            return !1;
        }
    }
    ,
    t.version = "3.0.0-rc.1",
    t;
}();
t.JSEncrypt = et
var CryptoJS = CryptoJS || (function(Math, undefined) {
    var C = {};
    var C_lib = C.lib = {};
    var Base = C_lib.Base = (function() {
        function F() {}
        ;return {
            extend: function(overrides) {
                F.prototype = this;
                var subtype = new F();
                if (overrides) {
                    subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                    subtype.init = function() {
                        subtype.$super.init.apply(this, arguments);
                    }
                    ;
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
            },
            create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
            },
            init: function() {},
            mixIn: function(properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },
            clone: function() {
                return this.init.prototype.extend(this);
            }
        };
    }());
    var WordArray = C_lib.WordArray = Base.extend({
        init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },
        toString: function(encoder) {
            return (encoder || Hex).stringify(this);
        },
        concat: function(wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();
            if (thisSigBytes % 4) {
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;
            return this;
        },
        clamp: function() {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },
        clone: function() {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
        },
        random: function(nBytes) {
            var words = [];
            var r = (function(m_w) {
                var m_w = m_w;
                var m_z = 0x3ade68b1;
                var mask = 0xffffffff;
                return function() {
                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                    var result = ((m_z << 0x10) + m_w) & mask;
                    result /= 0x100000000;
                    result += 0.5;
                    return result * (Math.random() > .5 ? 1 : -1);
                }
            }
            );
            for (var i = 0, rcache; i < nBytes; i += 4) {
                var _r = r((rcache || Math.random()) * 0x100000000);
                rcache = _r() * 0x3ade67b7;
                words.push((_r() * 0x100000000) | 0);
            }
            return new WordArray.init(words,nBytes);
        }
    });
    var C_enc = C.enc = {};
    var Hex = C_enc.Hex = {
        stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }
            return hexChars.join('');
        },
        parse: function(hexStr) {
            var hexStrLength = hexStr.length;
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }
            return new WordArray.init(words,hexStrLength / 2);
        }
    };
    var Latin1 = C_enc.Latin1 = {
        stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join('');
        },
        parse: function(latin1Str) {
            var latin1StrLength = latin1Str.length;
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }
            return new WordArray.init(words,latin1StrLength);
        }
    };
    var Utf8 = C_enc.Utf8 = {
        stringify: function(wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },
        parse: function(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        reset: function() {
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },
        _append: function(data) {
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },
        _process: function(doFlush) {
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            var nWordsReady = nBlocksReady * blockSize;
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    this._doProcessBlock(dataWords, offset);
                }
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }
            return new WordArray.init(processedWords,nBytesReady);
        },
        clone: function() {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
        },
        _minBufferSize: 0
    });
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        cfg: Base.extend(),
        init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
        },
        reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
        },
        update: function(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
        },
        finalize: function(messageUpdate) {
            if (messageUpdate) {
                this._append(messageUpdate);
            }
            var hash = this._doFinalize();
            return hash;
        },
        blockSize: 512 / 32,
        _createHelper: function(hasher) {
            return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
            }
            ;
        },
        _createHmacHelper: function(hasher) {
            return function(message, key) {
                return new C_algo.HMAC.init(hasher,key).finalize(message);
            }
            ;
        }
    });
    var C_algo = C.algo = {};
    return C;
}(Math));

(function() {
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;
    var Base64 = C_enc.Base64 = {
        stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;
            wordArray.clamp();
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }
            return base64Chars.join('');
        },
        parse: function(base64Str) {
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;
            if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                    reverseMap[map.charCodeAt(j)] = j;
                }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                    base64StrLength = paddingIndex;
                }
            }
            return parseLoop(base64Str, base64StrLength, reverseMap);
        },
        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
    function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;
        for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                nBytes++;
            }
        }
        return WordArray.create(words, nBytes);
    }
}());

CryptoJS.lib.Cipher || (function(undefined) {
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        cfg: Base.extend(),
        createEncryptor: function(key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },
        createDecryptor: function(key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },
        init: function(xformMode, key, cfg) {
            this.cfg = this.cfg.extend(cfg);
            this._xformMode = xformMode;
            this._key = key;
            this.reset();
        },
        reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
        },
        process: function(dataUpdate) {
            this._append(dataUpdate);
            return this._process();
        },
        finalize: function(dataUpdate) {
            if (dataUpdate) {
                this._append(dataUpdate);
            }
            var finalProcessedData = this._doFinalize();
            return finalProcessedData;
        },
        keySize: 128 / 32,
        ivSize: 128 / 32,
        _ENC_XFORM_MODE: 1,
        _DEC_XFORM_MODE: 2,
        _createHelper: (function() {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }
            return function(cipher) {
                return {
                    encrypt: function(message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },
                    decrypt: function(ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            }
            ;
        }())
    });
    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function() {
            var finalProcessedBlocks = this._process(!!'flush');
            return finalProcessedBlocks;
        },
        blockSize: 1
    });
    var C_mode = C.mode = {};
    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        createEncryptor: function(cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },
        createDecryptor: function(cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        },
        init: function(cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        }
    });
    var CBC = C_mode.CBC = (function() {
        var CBC = BlockCipherMode.extend();
        CBC.Encryptor = CBC.extend({
            processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
            }
        });
        CBC.Decryptor = CBC.extend({
            processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var thisBlock = words.slice(offset, offset + blockSize);
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);
                this._prevBlock = thisBlock;
            }
        });

        function xorBlock(words, offset, blockSize) {
            var iv = this._iv;
            if (iv) {
                var block = iv;
                this._iv = undefined;
            } else {
                var block = this._prevBlock;
            }
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }
        return CBC;
    }());
    var C_pad = C.pad = {};
    var Pkcs7 = C_pad.Pkcs7 = {
        pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);
            data.concat(padding);
        },
        unpad: function(data) {
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
            data.sigBytes -= nPaddingBytes;
        }
    };
    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
        }),
        reset: function() {
            Cipher.reset.call(this);
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else {
                var modeCreator = mode.createDecryptor;
                this._minBufferSize = 1;
            }
            if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
            } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
            }
        },
        _doProcessBlock: function(words, offset) {
            this._mode.processBlock(words, offset);
        },
        _doFinalize: function() {
            var padding = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                padding.pad(this._data, this.blockSize);
                var finalProcessedBlocks = this._process(!!'flush');
            } else {
                var finalProcessedBlocks = this._process(!!'flush');
                padding.unpad(finalProcessedBlocks);
            }
            return finalProcessedBlocks;
        },
        blockSize: 128 / 32
    });
    var CipherParams = C_lib.CipherParams = Base.extend({
        init: function(cipherParams) {
            this.mixIn(cipherParams);
        },
        toString: function(formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });
    var C_format = C.format = {};
    var OpenSSLFormatter = C_format.OpenSSL = {
        stringify: function(cipherParams) {
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;
            if (salt) {
                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var wordArray = ciphertext;
            }
            return wordArray.toString(Base64);
        },
        parse: function(openSSLStr) {
            var ciphertext = Base64.parse(openSSLStr);
            var ciphertextWords = ciphertext.words;
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                var salt = WordArray.create(ciphertextWords.slice(2, 4));
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }
            return CipherParams.create({
                ciphertext: ciphertext,
                salt: salt
            });
        }
    };
    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        cfg: Base.extend({
            format: OpenSSLFormatter
        }),
        encrypt: function(cipher, message, key, cfg) {
            cfg = this.cfg.extend(cfg);
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);
            var cipherCfg = encryptor.cfg;
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
            });
        },
        decrypt: function(cipher, ciphertext, key, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
            return plaintext;
        },
        _parse: function(ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
            } else {
                return ciphertext;
            }
        }
    });
    var C_kdf = C.kdf = {};
    var OpenSSLKdf = C_kdf.OpenSSL = {
        execute: function(password, keySize, ivSize, salt) {
            if (!salt) {
                salt = WordArray.random(64 / 8);
            }
            var key = EvpKDF.create({
                keySize: keySize + ivSize
            }).compute(password, salt);
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;
            return CipherParams.create({
                key: key,
                iv: iv,
                salt: salt
            });
        }
    };
    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
        }),
        encrypt: function(cipher, message, password, cfg) {
            cfg = this.cfg.extend(cfg);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
            cfg.iv = derivedParams.iv;
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
            ciphertext.mixIn(derivedParams);
            return ciphertext;
        },
        decrypt: function(cipher, ciphertext, password, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
            cfg.iv = derivedParams.iv;
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
            return plaintext;
        }
    });
}());

(function() {
    var C = CryptoJS;
    var C_lib = C.lib;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;
    var SBOX = [];
    var INV_SBOX = [];
    var SUB_MIX_0 = [];
    var SUB_MIX_1 = [];
    var SUB_MIX_2 = [];
    var SUB_MIX_3 = [];
    var INV_SUB_MIX_0 = [];
    var INV_SUB_MIX_1 = [];
    var INV_SUB_MIX_2 = [];
    var INV_SUB_MIX_3 = [];
    (function() {
        var d = [];
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                d[i] = i << 1;
            } else {
                d[i] = (i << 1) ^ 0x11b;
            }
        }
        var x = 0;
        var xi = 0;
        for (var i = 0; i < 256; i++) {
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];
            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
            SUB_MIX_2[x] = (t << 8) | (t >>> 24);
            SUB_MIX_3[x] = t;
            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
            INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
            INV_SUB_MIX_3[sx] = t;
            if (!x) {
                x = xi = 1;
            } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
            }
        }
    }());
    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
    var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function() {
            if (this._nRounds && this._keyPriorReset === this._key) {
                return;
            }
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;
            var nRounds = this._nRounds = keySize + 6;
            var ksRows = (nRounds + 1) * 4;
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                    keySchedule[ksRow] = keyWords[ksRow];
                } else {
                    var t = keySchedule[ksRow - 1];
                    if (!(ksRow % keySize)) {
                        t = (t << 8) | (t >>> 24);
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                        t ^= RCON[(ksRow / keySize) | 0] << 24;
                    } else if (keySize > 6 && ksRow % keySize == 4) {
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                    }
                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
            }
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;
                if (invKsRow % 4) {
                    var t = keySchedule[ksRow];
                } else {
                    var t = keySchedule[ksRow - 4];
                }
                if (invKsRow < 4 || ksRow <= 4) {
                    invKeySchedule[invKsRow] = t;
                } else {
                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^ INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                }
            }
        },
        encryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },
        decryptBlock: function(M, offset) {
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
        },
        _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            var nRounds = this._nRounds;
            var s0 = M[offset] ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];
            var ksRow = 4;
            for (var round = 1; round < nRounds; round++) {
                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
            }
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
            M[offset] = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
        },
        keySize: 256 / 32
    });
    C.AES = BlockCipher._createHelper(AES);
}());

var iv = CryptoJS.enc.Utf8.parse("f74ae0290a9e4b64");

function AES_Encrypt(a, word) {
    var key = CryptoJS.enc.Utf8.parse(test(a));
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
;
function AES_Decrypt(a, word) {
    var key = CryptoJS.enc.Utf8.parse(test(a));
    var srcs = word;
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}
;
function test(a) {
    var myEncrypt = new window.JSEncrypt();
    var privateKey = "MIICXQIBAAKBgQCNCr3gHu9eur+v8mZ04aRCejArM/YWpxSInYVh1hU/Byoua4qtiuZpO/wSG6uPFV+rAC8pLR6XzJtCoTr2qaIAmFCGlcjtqrOfKyDU68sLPfIRbdhCE/dF5V4IkyLoBaY5rOR+jEXP3ySdtzmk5tY2ETsmo1uAr1jDncQRfhhzqwIDAQABAoGALl1hndONjO6HJSfiVnn2rYPNYeZq93dlYKOnvUnLIjUQwMHJjNMke2Oksa827opwMJ6W4kpazDwOrhCieYO6JUiOeo7k5WK6StAOXxKdtMBuIlDi75YIr6mc24JLsn2CPmN2HC5siOa3VM8uMfq3bRFyve9pSZ6ZE/6VL3sQgMECQQDncnxXE5Fj3JbH2JHqxJv2WNjRR9YLBGT+n+eTnEaOvRjfDNQy+zlE/OZzjOnbZpaDuc18qS8mW1VWKBTKnsyvAkEAnAEUo0os8NA3s09OfqOsbR0J2mL6I9kMmionF5X5SWpFJQ4jyIEpVpBWISG8vrRzPmqizE1yPNBXR2e59xBfxQJBALns71PoJUiqgPnj0TxeWseoEez1H05UZmlhvV+ID+pEoAE2xhR6WkRAQUSb85VLsSf6j8dQBc9zWXdP1Xv724MCQGM44Lp2zByiIjs+vssXKO0BYinvd+9i9nv7QX/j2HkUSUQnOSUm2XcAOHe8MIMO3JmfU0okG/uH+2skEwiL9o0CQQCbZWxQdq6karWD0jxVUQP7wag5Z1Q3OtqJ+aaAfvPNBSCQBptdAvaouQnHywPv4YhdVDSFwLfllxb/FY7qMHM+"
    myEncrypt.setPrivateKey(privateKey);
    var result = myEncrypt.decryptLong(a);
    return result;

}
;
//加密测试：AES_Encrypt('Wqgcs83u0Fzog4IHcEl0R6+0hJu3ig+eUcI9OZ2jr0UXiF949csuxg2TQX+G+6OBhlDeZggZiBZhGQyirnCld+XtWcplNhuii34QAMUlWEqXQEwSotAROjWcZ3VM4QUFY/9msXN6jri3qew55jHvNzPhYAKnK/aLENgCnoACTIE=','tsmall#1609579439446#/shares/visit')
//参数1：https://wxmall-lv.topsports.com.cn/topsports/init初始化链接的返回data:{"code":1,"bizCode":20000,"bizMsg":"成功","data":"Wqgcs83u0Fzog4IHcEl0R6+0hJu3ig+eUcI9OZ2jr0UXiF949csuxg2TQX+G+6OBhlDeZggZiBZhGQyirnCld+XtWcplNhuii34QAMUlWEqXQEwSotAROjWcZ3VM4QUFY/9msXN6jri3qew55jHvNzPhYAKnK/aLENgCnoACTIE="}
//参数2：  'tsmall#1609579439446#/shares/visit' 其中/shares/visit， 1609579439446为时间戳  当前提交链接的url路径：https://wxmall-lv.topsports.com.cn/shares/visit?tssign=5JgB%2BKEbLt9drI4XtROctE35FJdZuV0XOC%2FyqZaVeIF2q7Jf9CvUabg9yt%2BHC4eY