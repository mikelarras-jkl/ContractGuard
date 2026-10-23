"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));

// node_modules/json-source-map/index.js
var require_json_source_map = __commonJS({
  "node_modules/json-source-map/index.js"(exports2) {
    "use strict";
    var escapedChars = {
      "b": "\b",
      "f": "\f",
      "n": "\n",
      "r": "\r",
      "t": "	",
      '"': '"',
      "/": "/",
      "\\": "\\"
    };
    var A_CODE = "a".charCodeAt();
    exports2.parse = function(source, _, options) {
      var pointers = {};
      var line = 0;
      var column = 0;
      var pos = 0;
      var bigint = options && options.bigint && typeof BigInt != "undefined";
      return {
        data: _parse("", true),
        pointers
      };
      function _parse(ptr, topLevel) {
        whitespace();
        var data;
        map(ptr, "value");
        var char = getChar();
        switch (char) {
          case "t":
            read("rue");
            data = true;
            break;
          case "f":
            read("alse");
            data = false;
            break;
          case "n":
            read("ull");
            data = null;
            break;
          case '"':
            data = parseString();
            break;
          case "[":
            data = parseArray(ptr);
            break;
          case "{":
            data = parseObject(ptr);
            break;
          default:
            backChar();
            if ("-0123456789".indexOf(char) >= 0)
              data = parseNumber();
            else
              unexpectedToken();
        }
        map(ptr, "valueEnd");
        whitespace();
        if (topLevel && pos < source.length) unexpectedToken();
        return data;
      }
      function whitespace() {
        loop:
          while (pos < source.length) {
            switch (source[pos]) {
              case " ":
                column++;
                break;
              case "	":
                column += 4;
                break;
              case "\r":
                column = 0;
                break;
              case "\n":
                column = 0;
                line++;
                break;
              default:
                break loop;
            }
            pos++;
          }
      }
      function parseString() {
        var str = "";
        var char;
        while (true) {
          char = getChar();
          if (char == '"') {
            break;
          } else if (char == "\\") {
            char = getChar();
            if (char in escapedChars)
              str += escapedChars[char];
            else if (char == "u")
              str += getCharCode();
            else
              wasUnexpectedToken();
          } else {
            str += char;
          }
        }
        return str;
      }
      function parseNumber() {
        var numStr = "";
        var integer = true;
        if (source[pos] == "-") numStr += getChar();
        numStr += source[pos] == "0" ? getChar() : getDigits();
        if (source[pos] == ".") {
          numStr += getChar() + getDigits();
          integer = false;
        }
        if (source[pos] == "e" || source[pos] == "E") {
          numStr += getChar();
          if (source[pos] == "+" || source[pos] == "-") numStr += getChar();
          numStr += getDigits();
          integer = false;
        }
        var result = +numStr;
        return bigint && integer && (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) ? BigInt(numStr) : result;
      }
      function parseArray(ptr) {
        whitespace();
        var arr = [];
        var i = 0;
        if (getChar() == "]") return arr;
        backChar();
        while (true) {
          var itemPtr = ptr + "/" + i;
          arr.push(_parse(itemPtr));
          whitespace();
          var char = getChar();
          if (char == "]") break;
          if (char != ",") wasUnexpectedToken();
          whitespace();
          i++;
        }
        return arr;
      }
      function parseObject(ptr) {
        whitespace();
        var obj = {};
        if (getChar() == "}") return obj;
        backChar();
        while (true) {
          var loc = getLoc();
          if (getChar() != '"') wasUnexpectedToken();
          var key = parseString();
          var propPtr = ptr + "/" + escapeJsonPointer(key);
          mapLoc(propPtr, "key", loc);
          map(propPtr, "keyEnd");
          whitespace();
          if (getChar() != ":") wasUnexpectedToken();
          whitespace();
          obj[key] = _parse(propPtr);
          whitespace();
          var char = getChar();
          if (char == "}") break;
          if (char != ",") wasUnexpectedToken();
          whitespace();
        }
        return obj;
      }
      function read(str) {
        for (var i = 0; i < str.length; i++)
          if (getChar() !== str[i]) wasUnexpectedToken();
      }
      function getChar() {
        checkUnexpectedEnd();
        var char = source[pos];
        pos++;
        column++;
        return char;
      }
      function backChar() {
        pos--;
        column--;
      }
      function getCharCode() {
        var count = 4;
        var code = 0;
        while (count--) {
          code <<= 4;
          var char = getChar().toLowerCase();
          if (char >= "a" && char <= "f")
            code += char.charCodeAt() - A_CODE + 10;
          else if (char >= "0" && char <= "9")
            code += +char;
          else
            wasUnexpectedToken();
        }
        return String.fromCharCode(code);
      }
      function getDigits() {
        var digits = "";
        while (source[pos] >= "0" && source[pos] <= "9")
          digits += getChar();
        if (digits.length) return digits;
        checkUnexpectedEnd();
        unexpectedToken();
      }
      function map(ptr, prop) {
        mapLoc(ptr, prop, getLoc());
      }
      function mapLoc(ptr, prop, loc) {
        pointers[ptr] = pointers[ptr] || {};
        pointers[ptr][prop] = loc;
      }
      function getLoc() {
        return {
          line,
          column,
          pos
        };
      }
      function unexpectedToken() {
        throw new SyntaxError("Unexpected token " + source[pos] + " in JSON at position " + pos);
      }
      function wasUnexpectedToken() {
        backChar();
        unexpectedToken();
      }
      function checkUnexpectedEnd() {
        if (pos >= source.length)
          throw new SyntaxError("Unexpected end of JSON input");
      }
    };
    exports2.stringify = function(data, _, options) {
      if (!validType(data)) return;
      var wsLine = 0;
      var wsPos, wsColumn;
      var whitespace = typeof options == "object" ? options.space : options;
      switch (typeof whitespace) {
        case "number":
          var len = whitespace > 10 ? 10 : whitespace < 0 ? 0 : Math.floor(whitespace);
          whitespace = len && repeat(len, " ");
          wsPos = len;
          wsColumn = len;
          break;
        case "string":
          whitespace = whitespace.slice(0, 10);
          wsPos = 0;
          wsColumn = 0;
          for (var j = 0; j < whitespace.length; j++) {
            var char = whitespace[j];
            switch (char) {
              case " ":
                wsColumn++;
                break;
              case "	":
                wsColumn += 4;
                break;
              case "\r":
                wsColumn = 0;
                break;
              case "\n":
                wsColumn = 0;
                wsLine++;
                break;
              default:
                throw new Error("whitespace characters not allowed in JSON");
            }
            wsPos++;
          }
          break;
        default:
          whitespace = void 0;
      }
      var json = "";
      var pointers = {};
      var line = 0;
      var column = 0;
      var pos = 0;
      var es6 = options && options.es6 && typeof Map == "function";
      _stringify(data, 0, "");
      return {
        json,
        pointers
      };
      function _stringify(_data, lvl, ptr) {
        map(ptr, "value");
        switch (typeof _data) {
          case "number":
          case "bigint":
          case "boolean":
            out("" + _data);
            break;
          case "string":
            out(quoted(_data));
            break;
          case "object":
            if (_data === null) {
              out("null");
            } else if (typeof _data.toJSON == "function") {
              out(quoted(_data.toJSON()));
            } else if (Array.isArray(_data)) {
              stringifyArray();
            } else if (es6) {
              if (_data.constructor.BYTES_PER_ELEMENT)
                stringifyArray();
              else if (_data instanceof Map)
                stringifyMapSet();
              else if (_data instanceof Set)
                stringifyMapSet(true);
              else
                stringifyObject();
            } else {
              stringifyObject();
            }
        }
        map(ptr, "valueEnd");
        function stringifyArray() {
          if (_data.length) {
            out("[");
            var itemLvl = lvl + 1;
            for (var i = 0; i < _data.length; i++) {
              if (i) out(",");
              indent(itemLvl);
              var item = validType(_data[i]) ? _data[i] : null;
              var itemPtr = ptr + "/" + i;
              _stringify(item, itemLvl, itemPtr);
            }
            indent(lvl);
            out("]");
          } else {
            out("[]");
          }
        }
        function stringifyObject() {
          var keys = Object.keys(_data);
          if (keys.length) {
            out("{");
            var propLvl = lvl + 1;
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = _data[key];
              if (validType(value)) {
                if (i) out(",");
                var propPtr = ptr + "/" + escapeJsonPointer(key);
                indent(propLvl);
                map(propPtr, "key");
                out(quoted(key));
                map(propPtr, "keyEnd");
                out(":");
                if (whitespace) out(" ");
                _stringify(value, propLvl, propPtr);
              }
            }
            indent(lvl);
            out("}");
          } else {
            out("{}");
          }
        }
        function stringifyMapSet(isSet) {
          if (_data.size) {
            out("{");
            var propLvl = lvl + 1;
            var first = true;
            var entries = _data.entries();
            var entry = entries.next();
            while (!entry.done) {
              var item = entry.value;
              var key = item[0];
              var value = isSet ? true : item[1];
              if (validType(value)) {
                if (!first) out(",");
                first = false;
                var propPtr = ptr + "/" + escapeJsonPointer(key);
                indent(propLvl);
                map(propPtr, "key");
                out(quoted(key));
                map(propPtr, "keyEnd");
                out(":");
                if (whitespace) out(" ");
                _stringify(value, propLvl, propPtr);
              }
              entry = entries.next();
            }
            indent(lvl);
            out("}");
          } else {
            out("{}");
          }
        }
      }
      function out(str) {
        column += str.length;
        pos += str.length;
        json += str;
      }
      function indent(lvl) {
        if (whitespace) {
          json += "\n" + repeat(lvl, whitespace);
          line++;
          column = 0;
          while (lvl--) {
            if (wsLine) {
              line += wsLine;
              column = wsColumn;
            } else {
              column += wsColumn;
            }
            pos += wsPos;
          }
          pos += 1;
        }
      }
      function map(ptr, prop) {
        pointers[ptr] = pointers[ptr] || {};
        pointers[ptr][prop] = {
          line,
          column,
          pos
        };
      }
      function repeat(n, str) {
        return Array(n + 1).join(str);
      }
    };
    var VALID_TYPES = ["number", "bigint", "boolean", "string", "object"];
    function validType(data) {
      return VALID_TYPES.indexOf(typeof data) >= 0;
    }
    var ESC_QUOTE = /"|\\/g;
    var ESC_B = /[\b]/g;
    var ESC_F = /\f/g;
    var ESC_N = /\n/g;
    var ESC_R = /\r/g;
    var ESC_T = /\t/g;
    function quoted(str) {
      str = str.replace(ESC_QUOTE, "\\$&").replace(ESC_F, "\\f").replace(ESC_B, "\\b").replace(ESC_N, "\\n").replace(ESC_R, "\\r").replace(ESC_T, "\\t");
      return '"' + str + '"';
    }
    var ESC_0 = /~/g;
    var ESC_1 = /\//g;
    function escapeJsonPointer(str) {
      return str.replace(ESC_0, "~0").replace(ESC_1, "~1");
    }
  }
});

// src/audit.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_json_source_map = __toESM(require_json_source_map());
var SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  "title",
  "description",
  "type",
  "properties",
  "required",
  "items",
  "additionalProperties",
  "enum",
  "const",
  "default"
]);
var SCHEMA_SUFFIX = ".schema.json";
var EXAMPLE_SUFFIX = ".example.json";
function auditPath(target2, pairingFile2) {
  const diagnostics2 = [];
  const schemaFiles = uniquePaths([
    ...discoverSchemaFiles(target2),
    ...pairingFile2 === void 0 ? [] : schemasFromPairingFile(pairingFile2)
  ]);
  for (const schemaFile of schemaFiles) {
    const raw = import_node_fs.default.readFileSync(schemaFile, "utf8");
    const mapped = (0, import_json_source_map.parse)(raw);
    const file = import_node_path.default.relative(process.cwd(), schemaFile) || schemaFile;
    diagnostics2.push(...auditSchema(mapped.data, mapped.pointers, file));
  }
  return diagnostics2;
}
function uniquePaths(files2) {
  return [...new Set(files2.map((file) => import_node_path.default.resolve(file)))];
}
function schemasFromPairingFile(pairingFile2) {
  const manifestPath = import_node_path.default.resolve(pairingFile2);
  if (!import_node_fs.default.existsSync(manifestPath)) {
    return [];
  }
  const parsed = JSON.parse(import_node_fs.default.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(parsed)) {
    return [];
  }
  const baseDir = import_node_path.default.dirname(manifestPath);
  const schemas = [];
  for (const entry of parsed) {
    if (!Array.isArray(entry) || entry.length < 2) {
      continue;
    }
    const exampleRel = entry[0];
    const schemaRel = entry[1];
    if (typeof exampleRel !== "string" || typeof schemaRel !== "string") {
      continue;
    }
    const exampleFile = import_node_path.default.resolve(baseDir, exampleRel);
    const schemaFile = import_node_path.default.resolve(baseDir, schemaRel);
    if (import_node_fs.default.existsSync(exampleFile) && import_node_fs.default.existsSync(schemaFile)) {
      schemas.push(schemaFile);
    }
  }
  return schemas;
}
function discoverSchemaFiles(root) {
  const found = [];
  function visit(dir) {
    const entries = import_node_fs.default.readdirSync(dir, { withFileTypes: true });
    const names = new Set(
      entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
    );
    if (names.has("schema.json") && names.has("example.json")) {
      found.push(import_node_path.default.join(dir, "schema.json"));
    }
    for (const name of names) {
      if (!name.endsWith(SCHEMA_SUFFIX)) {
        continue;
      }
      const stem = name.slice(0, -SCHEMA_SUFFIX.length);
      if (stem === "") {
        continue;
      }
      if (names.has(`${stem}${EXAMPLE_SUFFIX}`)) {
        found.push(import_node_path.default.join(dir, name));
      }
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        visit(import_node_path.default.join(dir, entry.name));
      }
    }
  }
  visit(root);
  return found;
}
function isSchemaLike(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function propertiesHasItems(properties) {
  return properties !== null && typeof properties === "object" && !Array.isArray(properties) && "items" in properties;
}
function joinPointer(base, token) {
  return `${base}/${token.replace(/~/g, "~0").replace(/\//g, "~1")}`;
}
function lineOf(pointers, jsonPointer) {
  const loc = pointers[jsonPointer];
  if (loc?.key !== void 0) {
    return loc.key.line + 1;
  }
  if (loc?.value !== void 0) {
    return loc.value.line + 1;
  }
  return 1;
}
function auditSchema(node, pointers, file, displayPointer = "", jsonPointer = "") {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return [];
  }
  const schema = node;
  const diagnostics2 = [];
  const here = displayPointer === "" ? "/" : displayPointer;
  const properties = schema.properties;
  const locating = (rule, displayPath, locPointer) => ({
    rule,
    path: displayPath,
    file,
    line: lineOf(pointers, locPointer)
  });
  if (schema.type === "array" && Array.isArray(schema.required)) {
    diagnostics2.push(
      locating("required-on-array", here, joinPointer(jsonPointer, "required"))
    );
  }
  if (Array.isArray(schema.items)) {
    diagnostics2.push(
      locating("items-as-array", here, joinPointer(jsonPointer, "items"))
    );
  }
  if (schema.type === "array" && propertiesHasItems(schema.properties)) {
    diagnostics2.push(
      locating("properties-items-in-array", here, joinPointer(jsonPointer, "properties"))
    );
  }
  for (const key of Object.keys(schema)) {
    if (!SCHEMA_KEYWORDS.has(key) && isSchemaLike(schema[key])) {
      diagnostics2.push(
        locating("orphan-property-keys", `${displayPointer}/${key}`, joinPointer(jsonPointer, key))
      );
    }
  }
  if (Array.isArray(schema.required)) {
    const declared = properties !== null && typeof properties === "object" && !Array.isArray(properties) ? new Set(Object.keys(properties)) : /* @__PURE__ */ new Set();
    for (const name of schema.required) {
      if (typeof name === "string" && !declared.has(name)) {
        diagnostics2.push(
          locating(
            "required-not-in-properties",
            `${displayPointer}/${name}`,
            joinPointer(jsonPointer, "required")
          )
        );
      }
    }
  }
  if (properties !== null && typeof properties === "object" && !Array.isArray(properties)) {
    for (const [name, child] of Object.entries(properties)) {
      diagnostics2.push(
        ...auditSchema(
          child,
          pointers,
          file,
          `${displayPointer}/${name}`,
          joinPointer(joinPointer(jsonPointer, "properties"), name)
        )
      );
    }
  }
  return diagnostics2;
}

// src/cli.ts
var target = process.argv[2];
if (target === void 0) {
  process.stderr.write("usage: yarn validate <ruta> [schemasAValidar.json]\n");
  process.exit(2);
}
var pairingFile = process.argv[3];
var diagnostics = auditPath(target, pairingFile);
for (const diagnostic of diagnostics) {
  process.stdout.write(
    `${diagnostic.file}:${diagnostic.line}: ${diagnostic.rule}: ${diagnostic.path}
`
  );
}
var files = new Set(diagnostics.map((diagnostic) => diagnostic.file)).size;
var errorWord = diagnostics.length === 1 ? "error" : "errores";
var fileWord = files === 1 ? "archivo" : "archivos";
process.stdout.write(`${diagnostics.length} ${errorWord} en ${files} ${fileWord}
`);
process.exit(diagnostics.length === 0 ? 0 : 1);
