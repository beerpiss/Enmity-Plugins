// SPDX-License-Identifier: 0BSD
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { bulk, filters } from "enmity-api/modules";
import { create } from "enmity-api/patcher";

interface Module {
  [key: string]: any;
}

const [
  MessagesModule,
  UploadsModule,
] = <Module[]> bulk(
  filters.byProps("sendMessage"),
  filters.byProps("uploadLocalFiles"),
);

const TimeRegex = new RegExp(
  "(?:0?\\d|1[0-2]):[0-5]\\d\\s*[ap]m|(?:[01]?\\d|2[0-3]):[0-5]\\d",
  "gi",
);

// 12h time is such a massive L
// https://gist.github.com/apolopena/ad4af8bb58e2b1f18b1e0bb78143ebdc
function convertTo24HourTime(time: string): string {
  const AMPM = time.slice(-2).toLowerCase();
  let timeArr = time.slice(0, -2).split(":");
  let retVal: string;
  if (AMPM === "am") {
    // catching edge-case of 12AM
    timeArr[0] = timeArr[0] === "12" ? "00" : timeArr[0];
    retVal = timeArr.join(":");
  } else if (AMPM === "pm") {
    // everything with PM can just be mod'd and added with 12 - the max will be 23
    timeArr[0] = String((Number(timeArr[0]) % 12) + 12);
    retVal = timeArr.join(":");
  } else {
    retVal = time;
  }
  return retVal;
}

// https://github.com/SpoonMcForky/replace-timestamps-pc/blob/main/index.js#L15-L20
function getUnixTimestamp(time: string): string {
  const date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
    .replace(/\d?\d:\d\d/, convertTo24HourTime(time).trim());
  const then = Math.round((new Date(date)).getTime() / 1000);
  if (isNaN(then)) return time;
  return `<t:${then}:t>`; //To change the time format, refer to https://github.com/discord/discord-api-docs/blob/master/docs/Reference.md#timestamp-styles
}

const TimestampsPlugin: Plugin = {
  name: "Timestamps",
  patches: [],

  onStart() {
    const MessageTimestampPatcher = create("message-timestamp-patcher");
    MessageTimestampPatcher.before(
      MessagesModule,
      "sendMessage",
      (_, args, __) => {
        // channel ID: args[0]
        if (args[1]["content"].search(TimeRegex) !== -1) {
          args[1]["content"] = args[1].content.replace(
            TimeRegex,
            (x: string) => getUnixTimestamp(x),
          );
        }
      },
    );

    const UploadTimestampPatcher = create("upload-timestamp-patcher");
    UploadTimestampPatcher.before(
      UploadsModule,
      "uploadLocalFiles",
      (_, args, __) => {
        // channel ID: args[0]["id"]
        if (args[3]["content"].search(TimeRegex) !== -1) {
          args[3]["content"] = args[3].content.replace(
            TimeRegex,
            (x: string) => getUnixTimestamp(x),
          );
        }
      },
    );
  },

  onStop() {
    this.patches = [];
  },
};

registerPlugin(TimestampsPlugin);
