// @flow
import { type Change } from "slate";
import { findDOMRange } from "slate-react";
import Debug from "debug";
import areSameLine from "../utils/are-same-line";
import getKeyAndOffsetAtOffset from "../utils/get-key-and-offset-at-offset";
import findOffset from "./helpers/find-offset";
import getRangeAtOffset from "./helpers/get-range-at-offset";

const debug = new Debug("slate:onKeyDown:plugins:delete-one-line");

export default function deleteLineBackward(change: Change) {
  const { value } = change;
  const { selection } = value;
  const { startBlock } = value;
  if (!startBlock || startBlock.isVoid) return undefined;

  let range = selection.isBackward ? selection.flip() : selection;

  const rectBenchmark: ClientRect = findDOMRange(
    selection
  ).getBoundingClientRect();

  if (areSameLine(range.collapseToStartOf(startBlock), rectBenchmark)) {
    return undefined;
  }

  debug("deletebackward");

  const blockOffset = findOffset(
    startBlock.getOffsetAtRange(selection),
    (offset: number) => {
      const testRange = getRangeAtOffset(startBlock, offset);
      return areSameLine(testRange, rectBenchmark);
    }
  );

  let { key, offset } = getKeyAndOffsetAtOffset(startBlock, blockOffset);
  range = range.moveAnchorTo(key, offset);
  if (range.isExpanded) {
    while (areSameLine(range, rectBenchmark)) {
      offset = offset - 1;
      if (offset < 0) {
        break;
      }
      range = range.moveAnchorTo(key, offset);
      if (!areSameLine(range, rectBenchmark)) {
        range = range.moveAnchorTo(key, offset + 1);
        break;
      }
    }
    change.deleteAtRange(range);
  }
  return change;
}
