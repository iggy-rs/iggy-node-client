# 1.0.0 (2024-06-20)


### Bug Fixes

* fix client auth quirks, add handleResponse & deserializePollMessage as transform stream ([af46059](https://github.com/T1B0/iggy-node-bin/commit/af46059a9e406596ec506703e744204fa27c2567))
* fix consumer group commands ([bb9ff9e](https://github.com/T1B0/iggy-node-bin/commit/bb9ff9e5aa66f6a3b053199778561ec633f0bb35))
* fix getStats command (add new totalCpuUsage field) ([#3](https://github.com/T1B0/iggy-node-bin/issues/3)) ([79280c7](https://github.com/T1B0/iggy-node-bin/commit/79280c7f39290adce6758cbe3b7a536f37a83624))
* fix message header typing ([656653d](https://github.com/T1B0/iggy-node-bin/commit/656653d6d938732ce6d390ce3cc8fef12150bd59))
* fix message headers serialization bug ([fab07bd](https://github.com/T1B0/iggy-node-bin/commit/fab07bdf0ab9a3c29310cbe9f3e66132042a4977))
* fix Partitioning.MessageKey type, fix indent ([f2e6ef7](https://github.com/T1B0/iggy-node-bin/commit/f2e6ef7b31608d337324e39984699461b639cf0f))
* fix tcp client options ([6ada317](https://github.com/T1B0/iggy-node-bin/commit/6ada317f6389c92dcff5ccce1f3959831fe7317e))
* fix updateUser and changePassword command ([158b284](https://github.com/T1B0/iggy-node-bin/commit/158b2843af935ebc25fb511456a7aa20adc9ae2b))
* fix var naming, add some test ([516e2e8](https://github.com/T1B0/iggy-node-bin/commit/516e2e89dc4fa291d16b45a464a5fa28c9b537db))
* get rid of enums, add type helpers ([2e691d6](https://github.com/T1B0/iggy-node-bin/commit/2e691d685c6fa92cf1fa10f42d06701c5301e27d))


### Features

* add base ci workflow ([#2](https://github.com/T1B0/iggy-node-bin/issues/2)) ([41e0a0b](https://github.com/T1B0/iggy-node-bin/commit/41e0a0bd19773c648b9853db5a252a8bee3bedca))
* add command client with socket pool management ([e3d8c28](https://github.com/T1B0/iggy-node-bin/commit/e3d8c282662ab8b0244245a89e02dc70057c8878))
* add CommandResponseStream to wrap tcp socket, add parallel call safetiness ([32dbd7e](https://github.com/T1B0/iggy-node-bin/commit/32dbd7e7c299050d2f023418b2a536c78bc5c1f2))
* add create, delete, join & leave consumer-group command ([237f0e7](https://github.com/T1B0/iggy-node-bin/commit/237f0e71105d120bf1f418e8ff0c2e92a8f38470))
* add createPartition & deletePartition command ([951ddcf](https://github.com/T1B0/iggy-node-bin/commit/951ddcf87e3e6e34c0869c9c1b35bd4daaf10e92))
* add createUser and deleteUser command ([271e8cf](https://github.com/T1B0/iggy-node-bin/commit/271e8cf8e67df7ae2caf6fa4a8d17e62eae09202))
* add getGroup and getGroups command ([0f3ba3c](https://github.com/T1B0/iggy-node-bin/commit/0f3ba3c422f7668e4fa7b2684e3309133a39d977))
* add getOffset and storeOffset command, fix typos ([a642468](https://github.com/T1B0/iggy-node-bin/commit/a642468ea45e906d79348cf4b1aaeab028acfb69))
* add pollMessage command ([24354c5](https://github.com/T1B0/iggy-node-bin/commit/24354c5af7d6451fb0552a575b47496c8776b646))
* add purgeTopic & purgeStream command ([9ed0794](https://github.com/T1B0/iggy-node-bin/commit/9ed0794e7553cfb4662c120e968783fe1250cee3))
* add SendMessages command ([8f4e71a](https://github.com/T1B0/iggy-node-bin/commit/8f4e71a3e2632ad01f9638b114971b76635dd675))
* add updateStream command ([5d5d851](https://github.com/T1B0/iggy-node-bin/commit/5d5d851d419be0fc10ce1c67179f04856da5867b))
* add updateTopic command ([761a9d0](https://github.com/T1B0/iggy-node-bin/commit/761a9d0bd20370d2562aaaa79c70dbd3cf4cefd7))
* add updateUser and changePassword command, fix permissions deserialization bug ([69672ba](https://github.com/T1B0/iggy-node-bin/commit/69672ba787f6966e8799fffc23e1139ba3b88be7))
* better error, add some test ([35af9b5](https://github.com/T1B0/iggy-node-bin/commit/35af9b559b5a4d0c95377fa9c54d302e98002a71))
* reorganize client declaration ([5fa2965](https://github.com/T1B0/iggy-node-bin/commit/5fa29656901b167edca06ceec369934e84c82761))
* start low level command api and base tcp client ([cf6d48f](https://github.com/T1B0/iggy-node-bin/commit/cf6d48f39e82c5d79ccd847de78b2b17cf37687e))
* start unit test on serialization ([30521f8](https://github.com/T1B0/iggy-node-bin/commit/30521f8ed3e670177688179fc3371391e0e26d1c))
* wraps command to higher level api, starts client ([2ae16e2](https://github.com/T1B0/iggy-node-bin/commit/2ae16e2f789e3468f3137b79c7fe7e0f0e335e95))
