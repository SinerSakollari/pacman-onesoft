import { scene, CENTER_MAP_POSITION } from 'src/app/component/game/phaserGame';

export function pacmanAnimInit() {
  let namesArray = [
    'pacmanEastAnim',
    'pacmanWestAnim',
    'pacmanNorthAnim',
    'pacmanSouthAnim',
  ];
  let indexArray = 0;

  for (var i = 0; i < 12; i += 3) {
    scene.anims.create({
      frames: scene.anims.generateFrameNumbers('pac-man', {
        start: i,
        end: i + 2,
      }),
      key: namesArray[indexArray],
      frameRate: 10,
      repeat: -1,
    });
    indexArray++;
  }
}

export function ghostsAnimInit() {
  let test = [
    {
      color: 'Red',
      direction: ['East', 'West', 'North', 'South'],
    },
    {
      color: 'Blue',
      direction: ['East', 'West', 'North', 'South'],
    },
    {
      color: 'Pink',
      direction: ['East', 'West', 'North', 'South'],
    },
    {
      color: 'Orange',
      direction: ['East', 'West', 'North', 'South'],
    },
    {
      color: 'frigthenedAnim',
    },
  ];

  for (let i = 0; i < test.length; i++) {
    if (test[i].color === 'frigthenedAnim') {
      scene.anims.create({
        frames: scene.anims.generateFrameNumbers('scared_ghost', {
          start: 0,
          end: 3,
        }),

        frameRate: 10,
        repeat: -1,
        key: 'frigthenedAnim',
      });
    } else {
      for (let j = i * 8; j < 8 * (i + 1); j = j + 2) {
        scene.anims.create({
          frames: scene.anims.generateFrameNumbers('ghost_test', {
            start: j,
            end: j + 1,
          }),

          frameRate: 10,
          repeat: -1,
          key: `ghost${test[i].color}${test[i].direction![j / 2 - i * 4]}`,
        });
      }
    }
  }
}

export function tweenMovement(target: any, callback: any) {
  var tween = scene.tweens.add({
    targets: target,
    x: CENTER_MAP_POSITION.x,
    y: CENTER_MAP_POSITION.y,
    ease: 'Linear',
    duration: 1000,
    repeat: 0,
    onComplete: function () {
      callback();
    },
  });
}
