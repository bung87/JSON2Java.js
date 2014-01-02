/*
    Copyright (C) 2013  bung <zh.bung@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
function JavaClass(className,callback){
    this.res="";
    this.callback=callback;
    this.ONLY_GETTER=true;
    this.LESS_GETTER=true;
    this.CLASSNAME=className;
    this.CLASSSTART="public class "+this.CLASSNAME+" {";
    this.CLASSEND="}";
    this.variables=[];
    this.methods=[];
    this.init();
}
JavaClass.prototype={
	init:function(){
		  this.STATEMENT_END=';';
             this.BOOLEAN_START='\tprivate boolean ';
        this.BOOLEAN_STATEMENT=[this.BOOLEAN_START,this.STATEMENT_END];
     this.OBJECT_STATEMENT_END=" = new Object();"
    
         this.LIST_STATEMENT_END=" = new ArrayList<Object>();"
    
    this.DATE_START=this.access_type("Date");
    this.OBJECT_START = this.access_type("Object");
    this.LIST_START=this.access_type("List<Object>");
    this.INT_START=this.access_type("int");
    this.STRING_START=this.access_type("String");
   
    this.INT_STATEMENT=[this.INT_START,this.STATEMENT_END];
    this.STRING_STATEMENT=[this.STRING_START,this.STATEMENT_END];
    this.OBJECT_STATEMENT=[this.OBJECT_START,this.OBJECT_STATEMENT_END];
    this.DATE_STATEMENT=[this.DATE_START,this.STATEMENT_END];
    this.LIST_STATEMENT=[this.LIST_START,this.LIST_STATEMENT_END];
    this.memberVariable={
        "boolean":this.BOOLEAN_STATEMENT,
        "int":this.INT_STATEMENT,
        "String":this.STRING_STATEMENT,
        "Object":this.OBJECT_STATEMENT,
        "Date":this.DATE_STATEMENT,
        "List":this.LIST_STATEMENT
    };
	},
    classname_changed:function(){
        this.CLASSSTART="public class "+this.CLASSNAME+" {";
    },
    access_changed:function(){
       this.init();
    },
    protoTypeOf:  function (o){
    var s=Object.prototype.toString.call(o);
   
    return  s.split(" ")[1].slice(0,-1);
   },
    access_type:function (type){
        return this.ONLY_GETTER || this.LESS_GETTER ? "\tpublic "+type+" " : "\tprivate "+type+" ";
    },
    _camelCase:function (name){
        return name[0].toUpperCase()+name.slice(1);
    },
    _subClass:function(type,name,o){
    	 var subClassName="ObjectOf"+this._camelCase(name);
        this.sg(type,name,true);
        if(o!=null){
            var p=function(){};
            p.prototype=this;
            var sub=new p(subClassName,this.callback);
            sub.variables=[];
            sub.methods=[];
            sub.CLASSNAME=subClassName;
            sub.classname_changed();
            sub.parse(o);
        }
    },
    sg:function (type,name,extendType){
        if(!extendType){
            this.variables.push(this.memberVariable[type].join(name));
        }else{
            var subClassName="ObjectOf"+this._camelCase(name);

            var v=this.memberVariable[type].join(name).replace(/Object/g,"ObjectOf"+this._camelCase(name));
          console.log(v);
            if(type="List") {type="List<"+subClassName+">"}else if(type="Object"){
            	type=subClassName;
            }
            this.variables.push(v);
        }
        console.log(type);
        var prefix="get";
        if(type=="boolean") prefix="is";
        var getter="\tpublic "+type+" "+prefix+this._camelCase(name)+"(){\n"+"\t\treturn "+name+";\n\t}";
        var setter="\tpublic void set"+this._camelCase(name)+"("+type+" "+name+"){\n"+"\t\tthis."+name+" = "+name+";\n\t}";
        if(this.ONLY_GETTER || this.LESS_GETTER){
            if(this.LESS_GETTER){
                if(type=="boolean") this.methods.push(getter);
            }else{
                this.methods.push(getter);
            }

        }else{
            this.methods.push(getter,setter);
        }

    },
    parse:function parse(json){
        for(o in json){
            switch(this.protoTypeOf(json[o])){
                case "Boolean":
                    this.sg("boolean",o);
                    break;
                case "Object":
                    this._subClass("Object",o,json[o]);
                    break;
                case "Array":
                    this._subClass("List",o,json[o].pop());
                    break;
                case "Number":
                    var s=o.toLowerCase();
                    if(s.indexOf('time')>=0 || s.indexOf("date")>=0){
                        this.sg("Date",o);
                    }else{
                        this.sg("int",o);
                    }
                    break;
                case "Date":
                    break;
                case "String":
                    this.sg("String",o);
                    break;
            }
        }
/*        import java.util.ArrayList;
import java.util.List;*/
console.log(this.variables);
        var struct=[this.CLASSSTART,this.variables.join("\n"),this.methods.join("\n"),this.CLASSEND];
        var res=struct.join("\n");
        if(res.indexOf('ArrayList')>=0){
            res="import java.util.ArrayList;\nimport java.util.List;\n\n"+res;
        }
        this.callback(res);
    }
}