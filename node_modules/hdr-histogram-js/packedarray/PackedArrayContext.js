"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var ResizeError_1 = require("./ResizeError");
/**
 * A packed-value, sparse array context used for storing 64 bit signed values.
 *
 * An array context is optimised for tracking sparsely set (as in mostly zeros) values that tend to not make
 * use pof the full 64 bit value range even when they are non-zero. The array context's internal representation
 * is such that the packed value at each virtual array index may be represented by 0-8 bytes of actual storage.
 *
 * An array context encodes the packed values in 8 "set trees" with each set tree representing one byte of the
 * packed value at the virtual index in question. The {@link #getPackedIndex(int, int, boolean)} method is used
 * to look up the byte-index corresponding to the given (set tree) value byte of the given virtual index, and can
 * be used to add entries to represent that byte as needed. As a succesful {@link #getPackedIndex(int, int, boolean)}
 * may require a resizing of the array, it can throw a {@link ResizeException} to indicate that the requested
 * packed index cannot be found or added without a resize of the physical storage.
 *
 */
exports.MINIMUM_INITIAL_PACKED_ARRAY_CAPACITY = 16;
var MAX_SUPPORTED_PACKED_COUNTS_ARRAY_LENGTH = Math.pow(2, 13) - 1; //(Short.MAX_VALUE / 4);  TODO ALEX why ???
var SET_0_START_INDEX = 0;
var NUMBER_OF_SETS = 8;
var LEAF_LEVEL_SHIFT = 3;
var NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET = 0;
var NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS = 1;
var PACKED_ARRAY_GROWTH_INCREMENT = 16;
var PACKED_ARRAY_GROWTH_FRACTION_POW2 = 4;
var pow = Math.pow, ceil = Math.ceil, log2 = Math.log2, max = Math.max;
var bitCount = function (n) {
    var bits = 0;
    while (n !== 0) {
        bits += bitCount32(n | 0);
        n /= 0x100000000;
    }
    return bits;
};
var bitCount32 = function (n) {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
};
var PackedArrayContext = /** @class */ (function () {
    function PackedArrayContext(virtualLength, initialPhysicalLength) {
        this.populatedShortLength = 0;
        this.topLevelShift = Number.MAX_VALUE; // Make it non-sensical until properly initialized.
        this.physicalLength = Math.max(initialPhysicalLength, exports.MINIMUM_INITIAL_PACKED_ARRAY_CAPACITY);
        this.isPacked =
            this.physicalLength <= MAX_SUPPORTED_PACKED_COUNTS_ARRAY_LENGTH;
        if (!this.isPacked) {
            this.physicalLength = virtualLength;
        }
        this.array = new ArrayBuffer(this.physicalLength * 8);
        this.initArrayViews(this.array);
        this.init(virtualLength);
    }
    PackedArrayContext.prototype.initArrayViews = function (array) {
        this.byteArray = new Uint8Array(array);
        this.shortArray = new Uint16Array(array);
        this.longArray = new Float64Array(array);
    };
    PackedArrayContext.prototype.init = function (virtualLength) {
        if (!this.isPacked) {
            // Deal with non-packed context init:
            this.virtualLength = virtualLength;
            return;
        }
        this.populatedShortLength = SET_0_START_INDEX + 8;
        // Populate empty root entries, and point to them from the root indexes:
        for (var i = 0; i < NUMBER_OF_SETS; i++) {
            this.setAtShortIndex(SET_0_START_INDEX + i, 0);
        }
        this.setVirtualLength(virtualLength);
    };
    PackedArrayContext.prototype.clear = function () {
        this.byteArray.fill(0);
    };
    PackedArrayContext.prototype.copyAndIncreaseSize = function (newPhysicalArrayLength, newVirtualArrayLength) {
        var ctx = new PackedArrayContext(newVirtualArrayLength, newPhysicalArrayLength);
        if (this.isPacked) {
            ctx.populateEquivalentEntriesWithEntriesFromOther(this);
        }
        return ctx;
    };
    PackedArrayContext.prototype.getPopulatedShortLength = function () {
        return this.populatedShortLength;
    };
    PackedArrayContext.prototype.getPopulatedLongLength = function () {
        return (this.getPopulatedShortLength() + 3) >> 2; // round up
    };
    PackedArrayContext.prototype.setAtByteIndex = function (byteIndex, value) {
        this.byteArray[byteIndex] = value;
    };
    PackedArrayContext.prototype.getAtByteIndex = function (byteIndex) {
        return this.byteArray[byteIndex];
    };
    /**
     * add a byte value to a current byte value in the array
     * @param byteIndex index of byte value to add to
     * @param valueToAdd byte value to add
     * @return the afterAddValue. ((afterAddValue & 0x100) != 0) indicates a carry.
     */
    PackedArrayContext.prototype.addAtByteIndex = function (byteIndex, valueToAdd) {
        var newValue = this.byteArray[byteIndex] + valueToAdd;
        this.byteArray[byteIndex] = newValue;
        return newValue;
    };
    PackedArrayContext.prototype.setPopulatedLongLength = function (newPopulatedLongLength) {
        this.populatedShortLength = newPopulatedLongLength << 2;
    };
    PackedArrayContext.prototype.getVirtualLength = function () {
        return this.virtualLength;
    };
    PackedArrayContext.prototype.length = function () {
        return this.physicalLength;
    };
    PackedArrayContext.prototype.setAtShortIndex = function (shortIndex, value) {
        this.shortArray[shortIndex] = value;
    };
    PackedArrayContext.prototype.setAtLongIndex = function (longIndex, value) {
        this.longArray[longIndex] = value;
    };
    PackedArrayContext.prototype.getAtShortIndex = function (shortIndex) {
        return this.shortArray[shortIndex];
    };
    PackedArrayContext.prototype.getIndexAtShortIndex = function (shortIndex) {
        return this.shortArray[shortIndex];
    };
    PackedArrayContext.prototype.setPackedSlotIndicators = function (entryIndex, newPackedSlotIndicators) {
        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET, newPackedSlotIndicators);
    };
    PackedArrayContext.prototype.getPackedSlotIndicators = function (entryIndex) {
        return (this.shortArray[entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET] &
            0xffff);
    };
    PackedArrayContext.prototype.getIndexAtEntrySlot = function (entryIndex, slot) {
        return this.getAtShortIndex(entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slot);
    };
    PackedArrayContext.prototype.setIndexAtEntrySlot = function (entryIndex, slot, newIndexValue) {
        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slot, newIndexValue);
    };
    PackedArrayContext.prototype.expandArrayIfNeeded = function (entryLengthInLongs) {
        var currentLength = this.length();
        if (currentLength < this.getPopulatedLongLength() + entryLengthInLongs) {
            var growthIncrement = max(entryLengthInLongs, PACKED_ARRAY_GROWTH_INCREMENT, this.getPopulatedLongLength() >> PACKED_ARRAY_GROWTH_FRACTION_POW2);
            throw new ResizeError_1.ResizeError(currentLength + growthIncrement);
        }
    };
    PackedArrayContext.prototype.newEntry = function (entryLengthInShorts) {
        // Add entry at the end of the array:
        var newEntryIndex = this.populatedShortLength;
        this.expandArrayIfNeeded((entryLengthInShorts >> 2) + 1);
        this.populatedShortLength = newEntryIndex + entryLengthInShorts;
        for (var i = 0; i < entryLengthInShorts; i++) {
            this.setAtShortIndex(newEntryIndex + i, -1); // Poison value -1. Must be overriden before reads
        }
        return newEntryIndex;
    };
    PackedArrayContext.prototype.newLeafEntry = function () {
        // Add entry at the end of the array:
        var newEntryIndex;
        newEntryIndex = this.getPopulatedLongLength();
        this.expandArrayIfNeeded(1);
        this.setPopulatedLongLength(newEntryIndex + 1);
        this.setAtLongIndex(newEntryIndex, 0);
        return newEntryIndex;
    };
    /**
     * Consolidate entry with previous entry verison if one exists
     *
     * @param entryIndex The shortIndex of the entry to be consolidated
     * @param previousVersionIndex the index of the previous version of the entry
     */
    PackedArrayContext.prototype.consolidateEntry = function (entryIndex, previousVersionIndex) {
        var previousVersionPackedSlotsIndicators = this.getPackedSlotIndicators(previousVersionIndex);
        // Previous version exists, needs consolidation
        var packedSlotsIndicators = this.getPackedSlotIndicators(entryIndex);
        var insertedSlotMask = packedSlotsIndicators ^ previousVersionPackedSlotsIndicators; // the only bit that differs
        var slotsBelowBitNumber = packedSlotsIndicators & (insertedSlotMask - 1);
        var insertedSlotIndex = bitCount(slotsBelowBitNumber);
        var numberOfSlotsInEntry = bitCount(packedSlotsIndicators);
        // Copy the entry slots from previous version, skipping the newly inserted slot in the target:
        var sourceSlot = 0;
        for (var targetSlot = 0; targetSlot < numberOfSlotsInEntry; targetSlot++) {
            if (targetSlot !== insertedSlotIndex) {
                var indexAtSlot = this.getIndexAtEntrySlot(previousVersionIndex, sourceSlot);
                if (indexAtSlot !== 0) {
                    this.setIndexAtEntrySlot(entryIndex, targetSlot, indexAtSlot);
                }
                sourceSlot++;
            }
        }
    };
    /**
     * Expand entry as indicated.
     *
     * @param existingEntryIndex the index of the entry
     * @param entryPointerIndex  index to the slot pointing to the entry (needs to be fixed up)
     * @param insertedSlotIndex  realtive [packed] index of slot being inserted into entry
     * @param insertedSlotMask   mask value fo slot being inserted
     * @param nextLevelIsLeaf    the level below this one is a leaf level
     * @return the updated index of the entry (-1 if epansion failed due to conflict)
     * @throws RetryException if expansion fails due to concurrent conflict, and caller should try again.
     */
    PackedArrayContext.prototype.expandEntry = function (existingEntryIndex, entryPointerIndex, insertedSlotIndex, insertedSlotMask, nextLevelIsLeaf) {
        var packedSlotIndicators = this.getAtShortIndex(existingEntryIndex) & 0xffff;
        packedSlotIndicators |= insertedSlotMask;
        var numberOfslotsInExpandedEntry = bitCount(packedSlotIndicators);
        if (insertedSlotIndex >= numberOfslotsInExpandedEntry) {
            throw new Error("inserted slot index is out of range given provided masks");
        }
        var expandedEntryLength = numberOfslotsInExpandedEntry + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS;
        // Create new next-level entry to refer to from slot at this level:
        var indexOfNewNextLevelEntry = 0;
        if (nextLevelIsLeaf) {
            indexOfNewNextLevelEntry = this.newLeafEntry(); // Establish long-index to new leaf entry
        }
        else {
            // TODO: Optimize this by creating the whole sub-tree here, rather than a step that will immediaterly expand
            // Create a new 1 word (empty, no slots set) entry for the next level:
            indexOfNewNextLevelEntry = this.newEntry(NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS); // Establish short-index to new leaf entry
            this.setPackedSlotIndicators(indexOfNewNextLevelEntry, 0);
        }
        var insertedSlotValue = indexOfNewNextLevelEntry;
        var expandedEntryIndex = this.newEntry(expandedEntryLength);
        // populate the packed indicators word:
        this.setPackedSlotIndicators(expandedEntryIndex, packedSlotIndicators);
        // Populate the inserted slot with the index of the new next level entry:
        this.setIndexAtEntrySlot(expandedEntryIndex, insertedSlotIndex, insertedSlotValue);
        this.setAtShortIndex(entryPointerIndex, expandedEntryIndex);
        this.consolidateEntry(expandedEntryIndex, existingEntryIndex);
        return expandedEntryIndex;
    };
    //
    //   ######   ######## ########    ##     ##    ###    ##             ## #### ##    ## ########  ######## ##     ##
    //  ##    ##  ##          ##       ##     ##   ## ##   ##            ##   ##  ###   ## ##     ## ##        ##   ##
    //  ##        ##          ##       ##     ##  ##   ##  ##           ##    ##  ####  ## ##     ## ##         ## ##
    //  ##   #### ######      ##       ##     ## ##     ## ##          ##     ##  ## ## ## ##     ## ######      ###
    //  ##    ##  ##          ##        ##   ##  ######### ##         ##      ##  ##  #### ##     ## ##         ## ##
    //  ##    ##  ##          ##         ## ##   ##     ## ##        ##       ##  ##   ### ##     ## ##        ##   ##
    //   ######   ########    ##          ###    ##     ## ######## ##       #### ##    ## ########  ######## ##     ##
    //
    PackedArrayContext.prototype.getRootEntry = function (setNumber, insertAsNeeded) {
        if (insertAsNeeded === void 0) { insertAsNeeded = false; }
        var entryPointerIndex = SET_0_START_INDEX + setNumber;
        var entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
        if (entryIndex == 0) {
            if (!insertAsNeeded) {
                return 0; // Index does not currently exist in packed array;
            }
            entryIndex = this.newEntry(NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS);
            // Create a new empty (no slots set) entry for the next level:
            this.setPackedSlotIndicators(entryIndex, 0);
            this.setAtShortIndex(entryPointerIndex, entryIndex);
        }
        return entryIndex;
    };
    /**
     * Get the byte-index (into the packed array) corresponding to a given (set tree) value byte of given virtual index.
     * Inserts new set tree nodes as needed if indicated.
     *
     * @param setNumber      The set tree number (0-7, 0 corresponding with the LSByte set tree)
     * @param virtualIndex   The virtual index into the PackedArray
     * @param insertAsNeeded If true, will insert new set tree nodes as needed if they do not already exist
     * @return the byte-index corresponding to the given (set tree) value byte of the given virtual index
     */
    PackedArrayContext.prototype.getPackedIndex = function (setNumber, virtualIndex, insertAsNeeded) {
        if (virtualIndex >= this.virtualLength) {
            throw new Error("Attempting access at index " + virtualIndex + ", beyond virtualLength " + this.virtualLength);
        }
        var entryPointerIndex = SET_0_START_INDEX + setNumber; // TODO init needed ?
        var entryIndex = this.getRootEntry(setNumber, insertAsNeeded);
        if (entryIndex == 0) {
            return -1; // Index does not currently exist in packed array;
        }
        // Work down the levels of non-leaf entries:
        for (var indexShift = this.topLevelShift; indexShift >= LEAF_LEVEL_SHIFT; indexShift -= 4) {
            var nextLevelIsLeaf = indexShift === LEAF_LEVEL_SHIFT;
            // Target is a packedSlotIndicators entry
            var packedSlotIndicators = this.getPackedSlotIndicators(entryIndex);
            var slotBitNumber = (virtualIndex / pow(2, indexShift)) & 0xf; //(virtualIndex >>> indexShift) & 0xf;
            var slotMask = 1 << slotBitNumber;
            var slotsBelowBitNumber = packedSlotIndicators & (slotMask - 1);
            var slotNumber = bitCount(slotsBelowBitNumber);
            if ((packedSlotIndicators & slotMask) === 0) {
                // The entryIndex slot does not have the contents we want
                if (!insertAsNeeded) {
                    return -1; // Index does not currently exist in packed array;
                }
                // Expand the entry, adding the index to new entry at the proper slot:
                entryIndex = this.expandEntry(entryIndex, entryPointerIndex, slotNumber, slotMask, nextLevelIsLeaf);
            }
            // Next level's entry pointer index is in the appropriate slot in in the entries array in this entry:
            entryPointerIndex =
                entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slotNumber;
            entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
        }
        // entryIndex is the long-index of a leaf entry that contains the value byte for the given set
        var byteIndex = (entryIndex << 3) + (virtualIndex & 0x7); // Determine byte index offset within leaf entry
        return byteIndex;
    };
    PackedArrayContext.prototype.determineTopLevelShiftForVirtualLength = function (virtualLength) {
        var sizeMagnitude = ceil(log2(virtualLength));
        var eightsSizeMagnitude = sizeMagnitude - 3;
        var multipleOfFourSizeMagnitude = ceil(eightsSizeMagnitude / 4) * 4;
        multipleOfFourSizeMagnitude = max(multipleOfFourSizeMagnitude, 8);
        var topLevelShiftNeeded = multipleOfFourSizeMagnitude - 4 + 3;
        return topLevelShiftNeeded;
    };
    PackedArrayContext.prototype.setVirtualLength = function (virtualLength) {
        if (!this.isPacked) {
            throw new Error("Should never be adjusting the virtual size of a non-packed context");
        }
        this.topLevelShift = this.determineTopLevelShiftForVirtualLength(virtualLength);
        this.virtualLength = virtualLength;
    };
    PackedArrayContext.prototype.getTopLevelShift = function () {
        return this.topLevelShift;
    };
    //
    //  ##     ##         ########   #######  ########  ##     ## ##          ###    ######## ########
    //   ##   ##          ##     ## ##     ## ##     ## ##     ## ##         ## ##      ##    ##
    //    ## ##           ##     ## ##     ## ##     ## ##     ## ##        ##   ##     ##    ##
    //     ###    ####### ########  ##     ## ########  ##     ## ##       ##     ##    ##    ######
    //    ## ##           ##        ##     ## ##        ##     ## ##       #########    ##    ##
    //   ##   ##          ##        ##     ## ##        ##     ## ##       ##     ##    ##    ##
    //  ##     ##         ##         #######  ##         #######  ######## ##     ##    ##    ########
    //
    PackedArrayContext.prototype.resizeArray = function (newLength) {
        var tmp = new Uint8Array(newLength * 8);
        tmp.set(this.byteArray);
        this.array = tmp.buffer;
        this.initArrayViews(this.array);
        this.physicalLength = newLength;
    };
    PackedArrayContext.prototype.populateEquivalentEntriesWithEntriesFromOther = function (other) {
        if (this.virtualLength < other.getVirtualLength()) {
            throw new Error("Cannot populate array of smaller virtual length");
        }
        for (var i = 0; i < NUMBER_OF_SETS; i++) {
            var otherEntryIndex = other.getAtShortIndex(SET_0_START_INDEX + i);
            if (otherEntryIndex == 0)
                continue; // No tree to duplicate
            var entryIndexPointer = SET_0_START_INDEX + i;
            for (var i_1 = this.topLevelShift; i_1 > other.topLevelShift; i_1 -= 4) {
                // for each inserted level:
                // Allocate entry in other:
                var sizeOfEntry = NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + 1;
                var newEntryIndex = this.newEntry(sizeOfEntry);
                // Link new level in.
                this.setAtShortIndex(entryIndexPointer, newEntryIndex);
                // Populate new level entry, use pointer to slot 0 as place to populate under:
                this.setPackedSlotIndicators(newEntryIndex, 0x1); // Slot 0 populated
                entryIndexPointer =
                    newEntryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS; // Where the slot 0 index goes.
            }
            this.copyEntriesAtLevelFromOther(other, otherEntryIndex, entryIndexPointer, other.topLevelShift);
        }
    };
    PackedArrayContext.prototype.copyEntriesAtLevelFromOther = function (other, otherLevelEntryIndex, levelEntryIndexPointer, otherIndexShift) {
        var nextLevelIsLeaf = otherIndexShift == LEAF_LEVEL_SHIFT;
        var packedSlotIndicators = other.getPackedSlotIndicators(otherLevelEntryIndex);
        var numberOfSlots = bitCount(packedSlotIndicators);
        var sizeOfEntry = NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + numberOfSlots;
        var entryIndex = this.newEntry(sizeOfEntry);
        this.setAtShortIndex(levelEntryIndexPointer, entryIndex);
        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET, packedSlotIndicators);
        for (var i = 0; i < numberOfSlots; i++) {
            if (nextLevelIsLeaf) {
                // Make leaf in other:
                var leafEntryIndex = this.newLeafEntry();
                this.setIndexAtEntrySlot(entryIndex, i, leafEntryIndex);
                // OPTIM
                // avoid iteration on all the values of the source ctx
                var otherNextLevelEntryIndex = other.getIndexAtEntrySlot(otherLevelEntryIndex, i);
                this.longArray[leafEntryIndex] =
                    other.longArray[otherNextLevelEntryIndex];
            }
            else {
                var otherNextLevelEntryIndex = other.getIndexAtEntrySlot(otherLevelEntryIndex, i);
                this.copyEntriesAtLevelFromOther(other, otherNextLevelEntryIndex, entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + i, otherIndexShift - 4);
            }
        }
    };
    PackedArrayContext.prototype.getAtUnpackedIndex = function (index) {
        return this.longArray[index];
    };
    PackedArrayContext.prototype.setAtUnpackedIndex = function (index, newValue) {
        this.longArray[index] = newValue;
    };
    PackedArrayContext.prototype.lazysetAtUnpackedIndex = function (index, newValue) {
        this.longArray[index] = newValue;
    };
    PackedArrayContext.prototype.incrementAndGetAtUnpackedIndex = function (index) {
        this.longArray[index]++;
        return this.longArray[index];
    };
    PackedArrayContext.prototype.addAndGetAtUnpackedIndex = function (index, valueToAdd) {
        this.longArray[index] += valueToAdd;
        return this.longArray[index];
    };
    //
    //   ########  #######           ######  ######## ########  #### ##    ##  ######
    //      ##    ##     ##         ##    ##    ##    ##     ##  ##  ###   ## ##    ##
    //      ##    ##     ##         ##          ##    ##     ##  ##  ####  ## ##
    //      ##    ##     ## #######  ######     ##    ########   ##  ## ## ## ##   ####
    //      ##    ##     ##               ##    ##    ##   ##    ##  ##  #### ##    ##
    //      ##    ##     ##         ##    ##    ##    ##    ##   ##  ##   ### ##    ##
    //      ##     #######           ######     ##    ##     ## #### ##    ##  ######
    //
    PackedArrayContext.prototype.nonLeafEntryToString = function (entryIndex, indexShift, indentLevel) {
        var output = "";
        for (var i = 0; i < indentLevel; i++) {
            output += "  ";
        }
        try {
            var packedSlotIndicators = this.getPackedSlotIndicators(entryIndex);
            output += "slotIndiators: 0x" + toHex(packedSlotIndicators) + ", prevVersionIndex: 0: [ ";
            var numberOfslotsInEntry = bitCount(packedSlotIndicators);
            for (var i = 0; i < numberOfslotsInEntry; i++) {
                output += this.getIndexAtEntrySlot(entryIndex, i);
                if (i < numberOfslotsInEntry - 1) {
                    output += ", ";
                }
            }
            output += " ] (indexShift = " + indexShift + ")\n";
            var nextLevelIsLeaf = indexShift == LEAF_LEVEL_SHIFT;
            for (var i = 0; i < numberOfslotsInEntry; i++) {
                var nextLevelEntryIndex = this.getIndexAtEntrySlot(entryIndex, i);
                if (nextLevelIsLeaf) {
                    output += this.leafEntryToString(nextLevelEntryIndex, indentLevel + 4);
                }
                else {
                    output += this.nonLeafEntryToString(nextLevelEntryIndex, indexShift - 4, indentLevel + 4);
                }
            }
        }
        catch (ex) {
            output += "Exception thrown at nonLeafEnty at index " + entryIndex + " with indexShift " + indexShift + "\n";
        }
        return output;
    };
    PackedArrayContext.prototype.leafEntryToString = function (entryIndex, indentLevel) {
        var output = "";
        for (var i = 0; i < indentLevel; i++) {
            output += "  ";
        }
        try {
            output += "Leaf bytes : ";
            for (var i = 0; i < 8; i++) {
                output += "0x" + toHex(this.byteArray[entryIndex * 8 + i]) + " ";
            }
            output += "\n";
        }
        catch (ex) {
            output += "Exception thrown at leafEnty at index " + entryIndex + "\n";
        }
        return output;
    };
    PackedArrayContext.prototype.toString = function () {
        var output = "PackedArrayContext:\n";
        if (!this.isPacked) {
            return output + "Context is unpacked:\n"; // unpackedToString();
        }
        for (var setNumber = 0; setNumber < NUMBER_OF_SETS; setNumber++) {
            try {
                var entryPointerIndex = SET_0_START_INDEX + setNumber;
                var entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
                output += "Set " + setNumber + ": root = " + entryIndex + " \n";
                if (entryIndex == 0)
                    continue;
                output += this.nonLeafEntryToString(entryIndex, this.topLevelShift, 4);
            }
            catch (ex) {
                output += "Exception thrown in set " + setNumber + "%d\n";
            }
        }
        //output += recordedValuesToString();
        return output;
    };
    return PackedArrayContext;
}());
exports.PackedArrayContext = PackedArrayContext;
var toHex = function (n) {
    return Number(n)
        .toString(16)
        .padStart(2, "0");
};
//# sourceMappingURL=PackedArrayContext.js.map