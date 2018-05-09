import { sumBy, find, sortBy, take, isNumber } from 'lodash';

const formatRecord = (record, oldRecord) => {
  switch (record.eventName) {
    case 'DISAPPEAR':
      if (record.read) {
        oldRecord.disappearRead += 1;
        oldRecord.onlyAppearRead -= 1;
      } else {
        oldRecord.disappearUnread += 1;
        oldRecord.onlyAppearUnread -= 1;
      }
      break;
    case 'APPEAR':
      if (record.read) {
        oldRecord.onlyAppearRead += 1;
      } else {
        oldRecord.onlyAppearUnread += 1;
      }
      break;
    case 'READ':
      if (record.appear) {
        oldRecord.onlyAppearRead += 1;
        oldRecord.onlyAppearUnread -= 1;
      } else {
        oldRecord.disappearRead += 1;
        oldRecord.disappearUnread -= 1;
      }
      break;
    default: // do nothing
  }
  return oldRecord;
};

const TOP_NUMBER = 3;

class Event {
  constructor(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getState() {
    return this.data.recordCountRank.map(p => ({
      id: p.id,
      type:
        p.onlyAppearUnread + p.onlyAppearRead === 0
          ? 'ALL_DISAPPEAR'
          : p.onlyAppearUnread === 0 ? 'ALL_READ' : 'SOME_UNREAD'
    }));
  }

  getTopPRank() {
    return take(sortBy(this.data.pRank, o => -o.p), TOP_NUMBER);
  }

  getTopEPRank() {
    return take(sortBy(this.data.epRank, o => -o.epM), TOP_NUMBER);
  }

  getTopCountRank() {
    return take(
      sortBy(
        this.data.recordCountRank,
        o => -(o.onlyAppearUnread + o.onlyAppearRead)
      ),
      TOP_NUMBER
    );
  }

  onPChange(pRecord) {
    const pRank = [
      ...this.data.pRank.filter(p => p.id !== pRecord.id),
      pRecord
    ];
    this.data = {
      ...this.data,
      pRank,
      p: sumBy(pRank.filter(p => isNumber(p.p)), o => o.p)
    };
  }

  getPChange(pRecord) {
    const oldRecord = find(this.data.pRank, p => p.id === pRecord.id);
    if (isNumber(oldRecord.p)) {
      return pRecord.p - oldRecord.p;
    }
    return pRecord.p;
  }

  onEPChange(epRecord) {
    const change = this.getEPChange(epRecord);
    const oldRecord = find(this.data.epRank, p => p.id === epRecord.id);
    const updatedRecord = {
      ...epRecord,
      epD: isNumber(oldRecord.epD) ? oldRecord.epD + change : change,
      epM: isNumber(oldRecord.epM) ? oldRecord.epM + change : change,
      epY: isNumber(oldRecord.epY) ? oldRecord.epY + change : change,
      ep: isNumber(oldRecord.ep) ? oldRecord.ep + change : change
    };
    const epRank = [
      ...this.data.epRank.filter(p => p.id !== epRecord.id),
      updatedRecord
    ];
    this.data = {
      ...this.data,
      epRank,
      ep: sumBy(epRank.filter(p => isNumber(p.ep)), o => o.ep),
      epY: sumBy(epRank.filter(p => isNumber(p.epY)), o => o.epY),
      epM: sumBy(epRank.filter(p => isNumber(p.epM)), o => o.epM),
      epD: sumBy(epRank.filter(p => isNumber(p.epD)), o => o.epD)
    };
  }

  getEPChange(epRecord) {
    const oldRecord = find(this.data.epRank, p => p.id === epRecord.id);
    if (isNumber(oldRecord.epM)) {
      return epRecord.ep - oldRecord.epM;
    }
    return epRecord.ep;
  }

  onRecordChange(record) {
    const oldRecord = find(
      this.data.recordCountRank,
      p => p.id === record.projectId
    );
    const recordCountRank = [
      ...this.data.recordCountRank.filter(p => p.id !== record.projectId),
      formatRecord(record, oldRecord)
    ];
    this.data = {
      ...this.data,
      recordCountRank,
      recordCount: sumBy(
        recordCountRank,
        o => o.onlyAppearRead + o.onlyAppearUnread
      )
    };
  }

  onFixChange(data) {
    this.data = {
      ...this.data,
      ...data
    };
  }
}

export default Event;
