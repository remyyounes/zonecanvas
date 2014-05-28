Function.prototype.Extend = function Extend(C, proto) {
    var P = (Function !== this) ? this : function Class(){};
    var F = function (){};
    C = C || function Fn() {};
    F.prototype = P.prototype;
    C.prototype = new F();
    for (var v in proto) {
        if (proto.hasOwnProperty(v)) {
            C.prototype[v] = proto[v];
        }
    }
    C.prototype.Constructor = C;
    C.prototype.Parent = P;
    return C;
};
