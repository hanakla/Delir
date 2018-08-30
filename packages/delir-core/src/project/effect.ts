import * as _ from 'lodash'
import * as uuid from 'uuid'

import Expression from '../Values/Expression'
import Keyframe from './keyframe'
import { EffectOptionScheme, EffectScheme } from './scheme/effect'
import { KeyframeScheme } from './scheme/keyframe'

export default class Effect
{

    get id(): string { return this._id }

    get processor(): string { return this._config.processor as string }
    set processor(processor: string) { this._config.processor = processor }

    get keyframeInterpolationMethod(): string { throw new Error('Effect.keyframeInterpolationMethod not implemented') }
    set keyframeInterpolationMethod(keyframeInterpolationMethod: string) { throw new Error('Effect.keyframeInterpolationMethod not implemented') }

    public static deserialize(effectJson: EffectScheme)
    {
        const effect = new Effect()

        const config = _.pick(effectJson.config, [
            'processor',
            'keyframeInterpolationMethod',
        ]) as EffectOptionScheme

        const keyframes = _.mapValues(effectJson.keyframes, keyframeSet => {
            return Array.from(keyframeSet).map(keyframe => Keyframe.deserialize(keyframe))
        })

        const expressions = _.mapValues(effectJson.expressions, expr => {
            return new Expression(expr.language, expr.code)
        })

        Object.defineProperty(effect, '_id', {value: effectJson.id || uuid.v4()})
        Object.assign(effect._config, config)
        effect.keyframes = keyframes
        effect.expressions = expressions

        return effect
    }

    public keyframes: {[keyName: string]: Keyframe[]} = {}

    public expressions: {[keyName: string]: Expression} = {}

    private _id: string = uuid.v4()

    private _config: EffectOptionScheme = {
        processor: null,
        keyframeInterpolationMethod: 'linear',
    }

    constructor()
    {
        Object.seal(this)
    }

    public toPreBSON(): EffectScheme
    {
        return {
            id: this.id,
            config: {...this._config},
            keyframes: _.mapValues(this.keyframes, (keyframeSeq, propName) => {
                return keyframeSeq.map(keyframe => keyframe.toPreBSON())
            }),
            expressions: _.cloneDeep(this.expressions)
        }
    }

    public toJSON(): EffectScheme
    {
        return {
            id: this.id,
            config: {...this._config},
            keyframes: _.mapValues(this.keyframes, (keyframeSeq, propName) => {
                return keyframeSeq.map(keyframe => keyframe.toJSON())
            }),
            expressions: _.cloneDeep(this.expressions)
        }
    }
}
