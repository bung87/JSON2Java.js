/*!
 * json2java.js
 * Author:bung
 * Summary:A Javascript program to generate Java model class from JSON    demo: http://www.bungos.me/project/json-java/
 * License:MIT
 * Version: 0.1.0
 *
 * URL:
 * https://github.com/bung87/Json2Java
 * https://github.com/bung87/Json2Java/blob/master/LICENSE
 *
 */
!function(a, b) {
    "function" == typeof define && "object" == typeof define.amd && define(b), 
    "undefined" != typeof window && (window.JSON2Java = b), 
    "undefined" != typeof module && (module.exports = b);
}("JSON2Java", function() {
    function a(a, b) {
        this.res = "", this.callback = b, this.ONLY_GETTER = !0, 
        this.LESS_GETTER = !0, this.CLASSNAME = a, this.CLASSSTART = "public class " + this.CLASSNAME + " {", 
        this.CLASSEND = "}", this.variables = [], this.methods = [], 
        this.init();
    }
    return a.prototype = {
        init: function() {
            this.STATEMENT_END = ";", this.BOOLEAN_START = "    private boolean ", 
            this.BOOLEAN_STATEMENT = [ this.BOOLEAN_START, this.STATEMENT_END ], 
            this.OBJECT_STATEMENT_END = " = new Object();", this.LIST_STATEMENT_END = " = new ArrayList<Object>();", 
            this.DATE_START = this.access_type("Date"), this.OBJECT_START = this.access_type("Object"), 
            this.LIST_START = this.access_type("List<Object>"), 
            this.INT_START = this.access_type("int"), this.STRING_START = this.access_type("String"), 
            this.INT_STATEMENT = [ this.INT_START, this.STATEMENT_END ], 
            this.STRING_STATEMENT = [ this.STRING_START, this.STATEMENT_END ], 
            this.OBJECT_STATEMENT = [ this.OBJECT_START, this.OBJECT_STATEMENT_END ], 
            this.DATE_STATEMENT = [ this.DATE_START, this.STATEMENT_END ], 
            this.LIST_STATEMENT = [ this.LIST_START, this.LIST_STATEMENT_END ], 
            this.memberVariable = {
                "boolean": this.BOOLEAN_STATEMENT,
                "int": this.INT_STATEMENT,
                String: this.STRING_STATEMENT,
                Object: this.OBJECT_STATEMENT,
                Date: this.DATE_STATEMENT,
                List: this.LIST_STATEMENT
            };
        },
        classname_changed: function() {
            this.CLASSSTART = "public class " + this.CLASSNAME + " {";
        },
        access_changed: function() {
            this.init();
        },
        protoTypeOf: function(a) {
            var b = Object.prototype.toString.call(a);
            return b.split(" ")[1].slice(0, -1);
        },
        access_type: function(a) {
            return this.ONLY_GETTER || this.LESS_GETTER ? " public " + a + " " : "  private " + a + " ";
        },
        _camelCase: function(a) {
            return a[0].toUpperCase() + a.slice(1);
        },
        _subClass: function(a, b, c) {
            var d = "ObjectOf" + this._camelCase(b);
            if (this.sg(a, b, !0), null != c) {
                var e = function() {};
                e.prototype = this;
                var f = new e(d, this.callback);
                f.variables = [], f.methods = [], f.CLASSNAME = d, 
                f.classname_changed(), f.parse(c);
            }
        },
        sg: function(a, b, c) {
            if (c) {
                var d = "ObjectOf" + this._camelCase(b), e = this.memberVariable[a].join(b).replace(/Object/g, "ObjectOf" + this._camelCase(b));
                (a = "List") ? a = "List<" + d + ">" : (a = "Object") && (a = d), 
                this.variables.push(e);
            } else this.variables.push(this.memberVariable[a].join(b));
            var f = "get";
            "boolean" == a && (f = "is");
            var g = "   public " + a + " " + f + this._camelCase(b) + "(){\n        return " + b + ";\n }", h = "   public void set" + this._camelCase(b) + "(" + a + " " + b + "){\n       this." + b + " = " + b + ";\n   }";
            this.ONLY_GETTER || this.LESS_GETTER ? this.LESS_GETTER ? "boolean" == a && this.methods.push(g) : this.methods.push(g) : this.methods.push(g, h);
        },
        parse: function(a) {
            for (o in a) switch (this.protoTypeOf(a[o])) {
              case "Boolean":
                this.sg("boolean", o);
                break;

              case "Object":
                this._subClass("Object", o, a[o]);
                break;

              case "Array":
                this._subClass("List", o, a[o].pop());
                break;

              case "Number":
                var b = o.toLowerCase();
                b.indexOf("time") >= 0 || b.indexOf("date") >= 0 ? this.sg("Date", o) : this.sg("int", o);
                break;

              case "Date":
                break;

              case "String":
                this.sg("String", o);
            }
            var c = [ this.CLASSSTART, this.variables.join("\n"), this.methods.join("\n"), this.CLASSEND ], d = c.join("\n");
            d.indexOf("ArrayList") >= 0 && (d = "import java.util.ArrayList;\nimport java.util.List;\n\n" + d), 
            this.callback(d);
        }
    }, a;
}());