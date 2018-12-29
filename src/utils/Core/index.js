/**
 * Core
 *
 * Made By Douzi＂
 */

import PlateformCore from './PlateformCore';
import UICore from './UICore';
import NetCore from './NetCore';
import CommonCore from './CommonCore';
import NavigatorCore from './NavigatorCore';
import StateCore from './StateCore';
import LocalCore from './LocalCore';
import MixinCore from './MixinCore';

var instance = {
  net: NetCore,
  ui: UICore,
  plateform: PlateformCore,
  common: CommonCore,
  navigator: NavigatorCore,
  local: LocalCore,
  state: StateCore,
  mixin: MixinCore
};

export default instance;