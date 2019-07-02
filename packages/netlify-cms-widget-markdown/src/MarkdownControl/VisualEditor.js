import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from '@emotion/styled';
import { css as coreCss, ClassNames } from '@emotion/core';
import { get, isEmpty, debounce, uniq } from 'lodash';
import { fromJS } from 'immutable';
import { Value, Document, Block, Text } from 'slate';
import { Editor as Slate } from 'slate-react';
import isHotkey from 'is-hotkey';
import { lengths } from 'netlify-cms-ui-default';
import { slateToMarkdown, markdownToSlate, htmlToSlate, markdownToHtml } from '../serializers';
import Toolbar from '../MarkdownControl/Toolbar';
import { renderBlock, renderInline, renderMark } from './renderers';
import plugins from './plugins/visual';
import schema from './schema';
import visualEditorStyles from './visualEditorStyles';
import { EditorControlBar } from '../styles';

const InsertionPoint = styled.div`
  flex: 1 1 auto;
  cursor: text;
`

const createEmptyRawDoc = () => {
  const emptyText = Text.create('');
  const emptyBlock = Block.create({ object: 'block', type: 'paragraph', nodes: [emptyText] });
  return { nodes: [emptyBlock] };
};

const createSlateValue = (rawValue, { voidCodeBlock }) => {
  const rawDoc = rawValue && markdownToSlate(rawValue, { voidCodeBlock });
  const rawDocHasNodes = !isEmpty(get(rawDoc, 'nodes'));
  const document = Document.fromJSON(rawDocHasNodes ? rawDoc : createEmptyRawDoc());
  return Value.create({ document });
};

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    const editorComponents = props.getEditorComponents();
    this.shortcodeComponents = editorComponents.filter(({ type }) => type === 'shortcode');
    this.codeBlockComponent = fromJS(editorComponents.find(({ type }) => type === 'code-block'));
    this.editorComponents =
      this.codeBlockComponent || editorComponents.has('code-block')
        ? editorComponents
        : editorComponents.set(
            'code-block',
            Map({
              label: 'Code Block',
              type: 'code-block',
            }),
          );
    this.renderBlock = renderBlock({
      classNameWrapper: props.className,
      resolveWidget: props.resolveWidget,
      codeBlockComponent: this.codeBlockComponent,
    });
    this.renderInline = renderInline();
    this.renderMark = renderMark();
    this.schema = schema({ voidCodeBlock: !!this.codeBlockComponent });
    this.plugins = plugins({ getAsset: props.getAsset, resolveWidget: props.resolveWidget });
    this.state = {
      value: createSlateValue(this.props.value, { voidCodeBlock: !!this.codeBlockComponent }),
      lastRawValue: this.props.value,
    };
  }

  static propTypes = {
    onAddAsset: PropTypes.func.isRequired,
    getAsset: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onMode: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: ImmutablePropTypes.map.isRequired,
    getEditorComponents: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const forcePropsValue = this.shouldForcePropsValue(
      this.props.value,
      this.state.lastRawValue,
      nextProps.value,
      nextState.lastRawValue,
    );

    return !this.state.value.equals(nextState.value) || forcePropsValue;
  }

  componentDidUpdate(prevProps, prevState) {
    const forcePropsValue = this.shouldForcePropsValue(
      prevProps.value,
      prevState.lastRawValue,
      this.props.value,
      this.state.lastRawValue,
    );

    if (forcePropsValue) {
      this.setState({
        value: createSlateValue(this.props.value, { voidCodeBlock: this.codeBlockComponent }),
        lastRawValue: this.props.value,
      });
    }
  }

  // If the old props/state values and new state value are all the same, and
  // the new props value does not match the others, the new props value
  // originated from outside of this widget and should be used.
  shouldForcePropsValue(oldPropsValue, oldStateValue, newPropsValue, newStateValue) {
    return (
      uniq([oldPropsValue, oldStateValue, newStateValue]).length === 1 &&
      oldPropsValue !== newPropsValue
    );
  }

  handleMarkClick = type => {
    this.editor.toggleMark(type).focus();
  };

  handleBlockClick = type => {
    this.editor.toggleBlock(type).focus();
  };

  handleLinkClick = () => {
    this.editor.toggleLink(() => window.prompt('Enter the URL of the link'));
  };

  hasMark = type => this.editor && this.editor.hasMark(type);
  hasInline = type => this.editor && this.editor.hasInline(type);
  hasBlock = type => this.editor && this.editor.hasBlock(type);

  handleToggleMode = () => {
    this.props.onMode('raw');
  };

  handleInsertShortcode = pluginConfig => {
    this.editor.insertShortcode(pluginConfig);
  };

  handleClickBelowDocument = () => {
    this.editor.moveToEndOfDocument();
  };

  handleDocumentChange = debounce(editor => {
    const { onChange } = this.props;
    const raw = editor.value.document.toJS();
    const markdown = slateToMarkdown(raw, { voidCodeBlock: this.codeBlockComponent });
    this.setState({ lastRawValue: markdown }, () => onChange(markdown));
  }, 150);

  handleChange = editor => {
    if (!this.state.value.document.equals(editor.value.document)) {
      this.handleDocumentChange(editor);
    }
    this.setState({ value: editor.value });
  };

  processRef = ref => {
    this.editor = ref;
  };

  render() {
    const { onAddAsset, getAsset, className, field } = this.props;
    return (
      <div
        css={coreCss`
          position: relative;
        `}
      >
        <EditorControlBar>
          <Toolbar
            onMarkClick={this.handleMarkClick}
            onBlockClick={this.handleBlockClick}
            onLinkClick={this.handleLinkClick}
            onToggleMode={this.handleToggleMode}
            plugins={this.editorComponents}
            onSubmit={this.handleInsertShortcode}
            onAddAsset={onAddAsset}
            getAsset={getAsset}
            buttons={field.get('buttons')}
            hasMark={this.hasMark}
            hasInline={this.hasInline}
            hasBlock={this.hasBlock}
          />
        </EditorControlBar>
        <ClassNames>
          {({ css, cx }) => (
            <div className={cx(className, css`${visualEditorStyles}`)}>
              <Slate
                className={css`
                  padding: 16px 20px 0;
                `}
                value={this.state.value}
                renderBlock={this.renderBlock}
                renderInline={this.renderInline}
                renderMark={this.renderMark}
                schema={this.schema}
                plugins={this.plugins}
                onChange={this.handleChange}
                ref={this.processRef}
                spellCheck
              />
              <InsertionPoint onClick={this.handleClickBelowDocument}/>
            </div>
          )}
        </ClassNames>
      </div>
    );
  }
}
