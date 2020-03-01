module.exports = {
  name: 'nxt',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/nxt',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
