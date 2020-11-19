import { dateInterval, getDateArray } from '../utils/util.js'
/**
 * 判断使用哪一种算法
 * mc1 最短经周期（天数）
 * mc2 最长月经周期（天数）
 */
function isRule(mc1, mc2) {
  if (mc2 - mc1 <= 2) {
    // 第一种算法
    return true
  } else {
    // 第二种算法
    return false
  }
};

/**
 * 获取月经的周期
 * md 月经开始日期;
 * bd 持续时间
 */
function menses(md, bd) {
  return getDateArray(md, dateInterval(md, bd - 1))
};

/**
 * 获取排卵的周期
 * md 月经开始日期;
 * mc1 最短经周期（天数）
 * mc2 最长月经周期（天数）
 */
function ovluate(md, mc1, mc2) {
  if (isRule(mc1, mc2)) {
    return getDateArray(dateInterval(md, mc1 - 19), dateInterval(md, mc2 - 12))
  } else {
    return getDateArray(dateInterval(md, mc1 - 19), dateInterval(md, mc2 - 10))
  }
}
/**
 * 获取排卵的周期的前一天 用来发短信的
 * md 月经开始日期;
 * mc1 最短经周期（天数）
 * mc2 最长月经周期（天数）
 */
function theDayBefore(md, mc1, mc2) {
  return dateInterval(ovluate(md, mc1, mc2)[0],-1);
}

/**
 * 获取排卵的日
 * md 月经开始日期;
 * mc1 最短经周期（天数）
 */
function ovluateDay(md, mc1, mc2) {
  return dateInterval(md, Math.floor(((mc1 + mc2) / 2 - 15)));
}

/**
 * 建议同房日期
 */
function mlDay(md, mc1, mc2) {
  return dateInterval(md, Math.floor(((mc1 + mc2) / 2 - 16)));
}

module.exports = {
  menses, ovluate, ovluateDay, mlDay, theDayBefore
}