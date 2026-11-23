import test from "node:test";
import assert from "node:assert/strict";
import {
  formatFileSize, validateFileType, validateFileSize,
  formatFileName, validateMultipleFiles, getFileInfo
} from "./index.js";

test("formats bytes", () => assert.equal(formatFileSize(2048), "2.00 KB"));
test("accepts an allowed extension", () => {
  assert.equal(validateFileType({name:"photo.png",type:"image/png"}, [".png"]), true);
});
test("rejects a disallowed type", () => {
  assert.equal(validateFileType({name:"note.txt",type:"text/plain"}, ["image/*"]), "File type is not allowed");
});
test("accepts a small file", () => assert.equal(validateFileSize({size:500}, 1), true));
test("rejects an oversized file", () => {
  assert.equal(validateFileSize({size:2*1024*1024}, 1), "File size must be less than 1 MB");
});
test("cleans file names", () => assert.equal(formatFileName("My Photo!.PNG"), "my-photo.png"));
test("validates a group of files", () => {
  const files = [{name:"a.png",type:"image/png",size:100},{name:"b.jpg",type:"image/jpeg",size:200}];
  assert.deepEqual(validateMultipleFiles(files, ["image/*"], 1, 3), {valid:true,errors:[]});
});
test("returns file details", () => {
  assert.deepEqual(getFileInfo({name:"a.pdf",type:"application/pdf",size:1024}),
    {name:"a.pdf",type:"application/pdf",size:"1.00 KB",sizeInBytes:1024});
});
