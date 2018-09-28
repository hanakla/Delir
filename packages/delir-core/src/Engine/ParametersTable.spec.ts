import { Clip, Keyframe } from '../Entity'
import { safeAssign } from '../helper/safeAssign'
import { Expression } from '../Values'
import { ParametersTable } from './ParametersTable'
import { IRenderContextBase } from './RenderContext/IRenderContextBase'
import { RenderContextBase } from './RenderContext/RenderContextBase'
import * as RendererFactory from './renderer'

describe('KeyframeTable', () => {
    let context: RenderContextBase
    let table: ParametersTable

    beforeEach(() => {
        context = new RenderContextBase({
            durationFrames: 100,
            framerate: 50,
        } as Partial<IRenderContextBase> as any)

        const clip = safeAssign(new Clip(), {
            renderer: 'video',
            placedFrame: 0,
            durationFrames: 100,
            keyframes: {
                'x': [
                    safeAssign(new Keyframe(), { frameOnClip: 0, value: 0 }),
                    safeAssign(new Keyframe(), { frameOnClip: 100, value: 100 }),
                ],
            },
            expressions: {
                'x': new Expression('typescript', 'currentValue * 10')
            }
        })

        table = ParametersTable.build(context, clip, clip.keyframes, clip.expressions, RendererFactory.getInfo('text').parameter)
    })

    it('Should correctly build table', () => {
        expect(table.initialParams).toMatchObject({ x: 0 })
        expect(table.lookUpTable).toMatchObject({ x: { '0': 0 } })
    })

    it('Should get parameters', () => {
        expect(table.getParametersAt(0)).toMatchObject({ x: 0 })
        expect(table.getParametersAt(100)).toMatchObject({ x: 100 })
    })

    it('Should get parameters with expression', () => {
        const frame = 100

        const clipRenderContext = context.toClipRenderContext({
            parameters: table.getParametersAt(frame),
            clipEffectParams: {},

            frameOnClip: frame,
            timeOnClip: frame / context.framerate,

            srcCanvas: null,
            destAudioBuffer: null,
            destCanvas: null,
        })

        expect(table.getParameterWithExpressionAt(100, {
            context: clipRenderContext,
            clipParams: {},
            referenceableEffectParams: {}
        })).toMatchObject({ x: 1000 })
    })
})
