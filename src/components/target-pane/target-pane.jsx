import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import { FormattedMessage } from 'react-intl';
import Label from '../forms/label.jsx';
import SpriteLibrary from '../../containers/sprite-library.jsx';
import SpriteSelectorComponent from '../sprite-selector/sprite-selector.jsx';
import StageSelector from '../../containers/stage-selector.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants';

import styles from './target-pane.css';

/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
const TargetPane = ({
    editingTarget,
    fileInputRef,
    hoveredTarget,
    spriteLibraryVisible,
    onActivateBlocksTab,
    onChangeSpriteDirection,
    onChangeSpriteName,
    onChangeSpriteRotationStyle,
    onChangeSpriteSize,
    onChangeSpriteVisibility,
    onChangeSpriteX,
    onChangeSpriteY,
    onDeleteSprite,
    onDrop,
    onDuplicateSprite,
    onExportSprite,
    onFileUploadClick,
    onNewSpriteClick,
    onPaintSpriteClick,
    onRequestCloseSpriteLibrary,
    onSelectSprite,
    onSpriteUpload,
    onSurpriseSpriteClick,
    raiseSprites,
    stage,
    stageSize,
    sprites,
    vm,
    ...componentProps
}) => {
    // Add mapping from spries to scenes here
    const [scenes, setScenes] = useState({});
    const [currSceneId, setCurrSceneId] = useState(1);
    const [spriteCount, setSpriteCount] = useState(0);
    
    const addScene = () => {
        const newId = Object.keys(scenes).length + 1;
        const newScenes = {...scenes};
        newScenes[newId] = {};
        setScenes(newScenes);
        console.log(newId);
    }

    if (spriteCount < Object.keys(sprites).length) {
        // console.log(sprites);
        // console.log(scenes[currSceneId]);
        const newScenes = {...scenes};

        const newSprites = {...scenes[currSceneId]};
        const newSprite = sprites[Object.keys(sprites)[Object.keys(sprites).length-1]]
        newSprites[Object.keys(sprites)[Object.keys(sprites).length-1]] = newSprite;
        
        newScenes[currSceneId] = newSprites;
        setScenes(newScenes);
        setSpriteCount(spriteCount + 1);
    }

    const SceneSelectorComponent = ({sceneId}) => {
        // console.log(scenes[sceneId])
        return (
            <Box
                className={classNames(styles.sceneSelector, {
                    [styles.isSelected]: sceneId == currSceneId,
                })}
            >
                <div className={styles.header} onClick={() => setCurrSceneId(sceneId)}>
                    <div className={styles.headerTitle}>
                        Scene {sceneId}
                    </div>
                </div>
                <div
                    className={styles.targetPane}
                    {...componentProps}
                >
                    <SpriteSelectorComponent
                        editingTarget={editingTarget}
                        hoveredTarget={hoveredTarget}
                        raised={raiseSprites}
                        selectedId={editingTarget}
                        spriteFileInput={fileInputRef}
                        sprites={scenes[sceneId] ?? sprites}
                        stageSize={stageSize}
                        onChangeSpriteDirection={onChangeSpriteDirection}
                        onChangeSpriteName={onChangeSpriteName}
                        onChangeSpriteRotationStyle={onChangeSpriteRotationStyle}
                        onChangeSpriteSize={onChangeSpriteSize}
                        onChangeSpriteVisibility={onChangeSpriteVisibility}
                        onChangeSpriteX={onChangeSpriteX}
                        onChangeSpriteY={onChangeSpriteY}
                        onDeleteSprite={onDeleteSprite}
                        onDrop={onDrop}
                        onDuplicateSprite={onDuplicateSprite}
                        onExportSprite={onExportSprite}
                        onFileUploadClick={onFileUploadClick}
                        onNewSpriteClick={onNewSpriteClick}
                        onPaintSpriteClick={onPaintSpriteClick}
                        onSelectSprite={onSelectSprite}
                        onSpriteUpload={onSpriteUpload}
                        onSurpriseSpriteClick={onSurpriseSpriteClick}
                    />
                    <div className={styles.stageSelectorWrapper}>
                        {stage.id && <StageSelector
                            asset={
                                stage.costume &&
                                stage.costume.asset
                            }
                            backdropCount={stage.costumeCount}
                            id={stage.id}
                            selected={stage.id === editingTarget}
                            onSelect={onSelectSprite}
                        />}
                        <div>
                            {spriteLibraryVisible ? (
                                <SpriteLibrary
                                    vm={vm}
                                    onActivateBlocksTab={onActivateBlocksTab}
                                    onRequestClose={onRequestCloseSpriteLibrary}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </Box>
        );
    }

    return <div className={styles.sceneWrapper}>
        {Object.keys(scenes).map(sceneId => <SceneSelectorComponent sceneId={sceneId} />)}
        <button onClick={addScene}>Add Scene</button>
    </div>;
}

const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        // asset is defined in scratch-storage's Asset.js
        asset: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        // The following are optional because costumes uploaded from disk
        // will not have these properties available
        bitmapResolution: PropTypes.number,
        rotationCenterX: PropTypes.number,
        rotationCenterY: PropTypes.number
    }),
    costumeCount: PropTypes.number,
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    size: PropTypes.number,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
});

TargetPane.propTypes = {
    editingTarget: PropTypes.string,
    extensionLibraryVisible: PropTypes.bool,
    fileInputRef: PropTypes.func,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    onActivateBlocksTab: PropTypes.func.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onExportSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    onRequestCloseSpriteLibrary: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    raiseSprites: PropTypes.bool,
    spriteLibraryVisible: PropTypes.bool,
    sprites: PropTypes.objectOf(spriteShape),
    stage: spriteShape,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM)
};

export default TargetPane;
