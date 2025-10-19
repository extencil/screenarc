import { useEditorStore } from '../../../store/editorStore'
import { Route, Wand, Pointer } from 'tabler-icons-react'
import { useShallow } from 'zustand/react/shallow'
import { Switch } from '../../ui/switch'
import { Slider } from '../../ui/slider'
import { Collapse } from '../../ui/collapse'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { SPRING_PHYSICS_PRESETS } from '../../../lib/anim'
import { SparklesIcon } from '../../ui/icons'

export function AnimationSettingsPanel() {
  const { motionBlur, cursorAnimation, zoomAnimation, updateMotionBlur, updateCursorAnimation, updateZoomAnimation } =
    useEditorStore(
      useShallow((state) => ({
        motionBlur: state.motionBlur,
        cursorAnimation: state.cursorAnimation,
        zoomAnimation: state.zoomAnimation,
        updateMotionBlur: state.updateMotionBlur,
        updateCursorAnimation: state.updateCursorAnimation,
        updateZoomAnimation: state.updateZoomAnimation,
      })),
    )

  const isCursorStyleCustom = cursorAnimation.style === 'custom'
  const isZoomStyleCustom = zoomAnimation.style === 'custom'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wand className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Animation & Motion Blur</h2>
            <p className="text-sm text-muted-foreground">Set global animation and blur effects</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto stable-scrollbar p-6 space-y-6">
        <Collapse
          title="Motion Blur"
          description="Applies cinematic motion blur when moving"
          icon={<SparklesIcon />}
          defaultOpen={true}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-sidebar-accent/30 border border-sidebar-border">
              <span className="text-sm font-medium text-sidebar-foreground">Enable Motion Blur</span>
              <Switch
                checked={motionBlur.enabled}
                onCheckedChange={(enabled) => updateMotionBlur({ enabled })}
                className="data-[state=on]:bg-primary"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-sidebar-foreground">Master Amount</label>
                <span className="text-xs font-semibold text-primary tabular-nums">{motionBlur.amount}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={motionBlur.amount}
                onChange={(amount) => updateMotionBlur({ amount })}
                disabled={!motionBlur.enabled}
              />
            </div>
            <Collapse title="Advanced Settings" defaultOpen={false}>
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Cursor Movement</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">{motionBlur.cursor}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={motionBlur.cursor}
                    onChange={(cursor) => updateMotionBlur({ cursor })}
                    disabled={!motionBlur.enabled}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Screen Zooming</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">{motionBlur.zoom}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={motionBlur.zoom}
                    onChange={(zoom) => updateMotionBlur({ zoom })}
                    disabled={!motionBlur.enabled}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Screen Panning</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">{motionBlur.pan}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={motionBlur.pan}
                    onChange={(pan) => updateMotionBlur({ pan })}
                    disabled={!motionBlur.enabled}
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </Collapse>

        <Collapse
          title="Cursor Animation"
          description="Style for cursor tracking movement"
          icon={<Pointer />}
          defaultOpen={true}
        >
          <div className="space-y-4">
            <Select
              value={cursorAnimation.style}
              onValueChange={(style) => updateCursorAnimation({ style: style as keyof typeof SPRING_PHYSICS_PRESETS })}
            >
              <SelectTrigger className="h-10 bg-background/50">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {isCursorStyleCustom && (
                  <SelectItem value="custom" disabled>
                    Custom
                  </SelectItem>
                )}
                {Object.entries(SPRING_PHYSICS_PRESETS).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Collapse title="Advanced Settings" defaultOpen={false}>
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Tension</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {cursorAnimation.tension.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    min={50}
                    max={500}
                    step={10}
                    value={cursorAnimation.tension}
                    onChange={(tension) => updateCursorAnimation({ tension })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Friction</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {cursorAnimation.friction.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={2}
                    value={cursorAnimation.friction}
                    onChange={(friction) => updateCursorAnimation({ friction })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Mass</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {cursorAnimation.mass.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={cursorAnimation.mass}
                    onChange={(mass) => updateCursorAnimation({ mass })}
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </Collapse>

        <Collapse title="Zoom Animation" description="Style for zoom transitions" icon={<Route />} defaultOpen={true}>
          <div className="space-y-4">
            <Select
              value={zoomAnimation.style}
              onValueChange={(style) => updateZoomAnimation({ style: style as keyof typeof SPRING_PHYSICS_PRESETS })}
            >
              <SelectTrigger className="h-10 bg-background/50">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {isZoomStyleCustom && (
                  <SelectItem value="custom" disabled>
                    Custom
                  </SelectItem>
                )}
                {Object.entries(SPRING_PHYSICS_PRESETS).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Collapse title="Advanced Settings" defaultOpen={false}>
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Tension</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {zoomAnimation.tension.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    min={50}
                    max={500}
                    step={10}
                    value={zoomAnimation.tension}
                    onChange={(tension) => updateZoomAnimation({ tension })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Friction</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {zoomAnimation.friction.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={2}
                    value={zoomAnimation.friction}
                    onChange={(friction) => updateZoomAnimation({ friction })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sidebar-foreground">Mass</label>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      {zoomAnimation.mass.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={zoomAnimation.mass}
                    onChange={(mass) => updateZoomAnimation({ mass })}
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </Collapse>
      </div>
    </div>
  )
}
