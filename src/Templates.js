import { MoveableMixin, SightMixin } from './Mixins.js';

export const playerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 6,
    mixins: [new MoveableMixin(),  new SightMixin()],
};
