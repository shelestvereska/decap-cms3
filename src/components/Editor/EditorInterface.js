import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SplitPane from 'react-split-pane';
import classnames from 'classnames';
import { ScrollSync, ScrollSyncPane } from './EditorScrollSync';
import { Icon } from 'UI'
import EditorControlPane from './EditorControlPane/EditorControlPane';
import EditorPreviewPane from './EditorPreviewPane/EditorPreviewPane';
import EditorToolbar from './EditorToolbar';
import EditorToggle from './EditorToggle';

const PREVIEW_VISIBLE = 'cms.preview-visible';
const SCROLL_SYNC_ENABLED = 'cms.scroll-sync-enabled';

class EditorInterface extends Component {
  state = {
    showEventBlocker: false,
    previewVisible: localStorage.getItem(PREVIEW_VISIBLE) !== "false",
    scrollSyncEnabled: localStorage.getItem(SCROLL_SYNC_ENABLED) !== "false",
  };

  handleSplitPaneDragStart = () => {
    this.setState({ showEventBlocker: true });
  };

  handleSplitPaneDragFinished = () => {
    this.setState({ showEventBlocker: false });
  };

  handleOnPersist = () => {
    this.controlPaneRef.validate();
    this.props.onPersist();
  };

  handleTogglePreview = () => {
    const newPreviewVisible = !this.state.previewVisible;
    this.setState({ previewVisible: newPreviewVisible });
    localStorage.setItem(PREVIEW_VISIBLE, newPreviewVisible);
  };

  handleToggleScrollSync = () => {
    const newScrollSyncEnabled = !this.state.scrollSyncEnabled;
    this.setState({ scrollSyncEnabled: newScrollSyncEnabled });
    localStorage.setItem(SCROLL_SYNC_ENABLED, newScrollSyncEnabled);
  };

  render() {
    const {
      collection,
      entry,
      fields,
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      enableSave,
      showDelete,
      onDelete,
      onValidate,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      user,
      hasChanged,
      displayUrl,
    } = this.props;

    const { previewVisible, scrollSyncEnabled, showEventBlocker } = this.state;

    const collectionPreviewEnabled = collection.getIn(['editor', 'preview'], true);

    const editor = (
      <div className={classnames('nc-entryEditor-controlPane', { 'nc-entryEditor-blocker': showEventBlocker })}>
        <EditorControlPane
          collection={collection}
          entry={entry}
          fields={fields}
          fieldsMetaData={fieldsMetaData}
          fieldsErrors={fieldsErrors}
          mediaPaths={mediaPaths}
          getAsset={getAsset}
          onChange={onChange}
          onValidate={onValidate}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onAddAsset={onAddAsset}
          onRemoveInsertedMedia={onRemoveInsertedMedia}
          ref={c => this.controlPaneRef = c} // eslint-disable-line
        />
      </div>
    );

    const editorWithPreview = (
      <ScrollSync enabled={this.state.scrollSyncEnabled}>
        <div>
          <SplitPane
            maxSize={-100}
            defaultSize="50%"
            onDragStarted={this.handleSplitPaneDragStart}
            onDragFinished={this.handleSplitPaneDragFinished}
          >
            <ScrollSyncPane>{editor}</ScrollSyncPane>
            <div className={classnames('nc-entryEditor-previewPane', { 'nc-entryEditor-blocker': showEventBlocker })}>
              <EditorPreviewPane
                collection={collection}
                entry={entry}
                fields={fields}
                fieldsMetaData={fieldsMetaData}
                getAsset={getAsset}
              />
            </div>
          </SplitPane>
        </div>
      </ScrollSync>
    );

    const editorWithoutPreview = (
      <div className="nc-entryEditor-noPreviewEditorContainer">
        {editor}
      </div>
    );

    return (
      <div className="nc-entryEditor-containerOuter">
        <EditorToolbar
          isPersisting={entry.get('isPersisting')}
          onPersist={this.handleOnPersist}
          onDelete={onDelete}
          showDelete={showDelete}
          enableSave={enableSave}
          user={user}
          hasChanged={hasChanged}
          displayUrl={displayUrl}
          collection={collection}
        />
        <div className="nc-entryEditor-container">
          <div className="nc-entryEditor-viewControls">
            <EditorToggle
              enabled={collectionPreviewEnabled}
              active={previewVisible}
              onClick={this.handleTogglePreview}
              icon="eye"
            />
            <EditorToggle
              enabled={collectionPreviewEnabled && previewVisible}
              active={scrollSyncEnabled}
              onClick={this.handleToggleScrollSync}
              icon="scroll"
            />
          </div>
          {
            collectionPreviewEnabled && this.state.previewVisible
              ? editorWithPreview
              : editorWithoutPreview
          }
        </div>
      </div>
    );
  }
}

EditorInterface.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  fieldsErrors: ImmutablePropTypes.map.isRequired,
  mediaPaths: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onPersist: PropTypes.func.isRequired,
  enableSave: PropTypes.bool.isRequired,
  showDelete: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRemoveInsertedMedia: PropTypes.func.isRequired,
  user: ImmutablePropTypes.map,
  hasChanged: PropTypes.bool,
  displayUrl: PropTypes.string,
};

export default EditorInterface;
