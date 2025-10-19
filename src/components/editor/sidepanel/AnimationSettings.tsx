import { useEditorStore } from '../../../store/editorStore'
import type { ZoomRegion } from '../../../types'
import { Collapse } from '../../ui/collapse'
import { Route } from 'tabler-icons-react'
import { DEFAULTS } from '../../../lib/constants'
import { Slider } from '../../ui/slider'

interface AnimationSettingsProps {
  region: ZoomRegion
}

export function AnimationSettings({ region }: AnimationSettingsProps) {
  const { updateRegion } = useEditorStore.getState()

  const handleZoomLevelChange = (value: number) => {
    updateRegion(region.id, { zoomLevel: value })
  }

  const handleResetAnimation = () => {
    updateRegion(region.id, {
      zoomLevel: DEFAULTS.ANIMATION.ZOOM_LEVEL.defaultValue,
    })
  }

  return (
    <Collapse
      title="Animation & Level"
      description="Adjust zoom level"
      icon={<Route className="w-4 h-4 text-primary" />}
      defaultOpen={true}
      onReset={handleResetAnimation}
    >
      <div className="space-y-6">
        {/* Zoom Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-sidebar-foreground">Zoom Level</label>
            <span className="text-xs font-semibold text-primary tabular-nums">{region.zoomLevel.toFixed(1)}x</span>
          </div>
          <Slider
            min={DEFAULTS.ANIMATION.ZOOM_LEVEL.min}
            max={DEFAULTS.ANIMATION.ZOOM_LEVEL.max}
            step={DEFAULTS.ANIMATION.ZOOM_LEVEL.step}
            value={region.zoomLevel}
            onChange={handleZoomLevelChange}
          />
        </div>
      </div>
    </Collapse>
  )
}
