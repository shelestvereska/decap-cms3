import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map, fromJS } from 'immutable';
import { partial } from 'lodash';
import c from 'classnames';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon, ListItemTopBar } from 'UI';
import ObjectControl from 'EditorWidgets/Object/ObjectControl';

function ListItem(props) {
  return <div {...props} className={`list-item ${ props.className || '' }`}>{props.children}</div>;
}
ListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
ListItem.displayName = 'list-item';

function valueToString(value) {
  return value ? value.join(',').replace(/,([^\s]|$)/g, ', $1') : '';
}

const SortableListItem = SortableElement(ListItem);

const TopBar = ({ onAdd, listLabel, listCollapsed, onCollapseToggle, onCollapseAllToggle, allItemsCollapsed, itemsCount }) => (
  <div className="nc-listControl-topBar">
    <div className="nc-listControl-listCollapseToggle" onClick={onCollapseToggle}>
      <Icon type="caret" direction={listCollapsed ? 'up' : 'down'} size="small" />
      {itemsCount} {listLabel}
    </div>
    {!listCollapsed && itemsCount > 0 ?
    <button className="nc-listControl-listCollapseToggleAll" onClick={onCollapseAllToggle}>
      <span>{allItemsCollapsed ? 'Expand all' : 'Collapse all'}</span>
    </button>
    : null }
    <button className="nc-listControl-addButton" onClick={onAdd}>
      Add {listLabel} <Icon type="add" size="xsmall" />
    </button>
  </div>
);

const SortableList = SortableContainer(({ items, renderItem }) => {
  return <div>{items.map(renderItem)}</div>;
});

const valueTypes = {
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE',
};

export default class ListControl extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onChangeObject: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      ImmutablePropTypes.list,
      PropTypes.string,
    ]),
    field: PropTypes.node,
    forID: PropTypes.string,
    mediaPaths: ImmutablePropTypes.map.isRequired,
    getAsset: PropTypes.func.isRequired,
    onOpenMediaLibrary: PropTypes.func.isRequired,
    onAddAsset: PropTypes.func.isRequired,
    onRemoveInsertedMedia: PropTypes.func.isRequired,
    classNameWrapper: PropTypes.string.isRequired,
    setActiveStyle: PropTypes.func.isRequired,
    setInactiveStyle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      listCollapsed: false,
      itemsCollapsed: List(),
      value: valueToString(props.value),
      allItemsCollapsed: false,
    };
    this.valueType = null;
  }

  /**
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */
  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    const { field } = this.props;
    if (field.get('fields')) {
      this.valueType = valueTypes.MULTIPLE;
    } else if (field.get('field')) {
      this.valueType = valueTypes.SINGLE;
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.field === nextProps.field) return;

    if (nextProps.field.get('fields')) {
      this.valueType = valueTypes.MULTIPLE;
    } else if (nextProps.field.get('field')) {
      this.valueType = valueTypes.SINGLE;
    }
  }

  handleChange = (e) => {
    const { onChange } = this.props;
    const oldValue = this.state.value;
    const newValue = e.target.value;
    const listValue = e.target.value.split(',');
    if (newValue.match(/,$/) && oldValue.match(/, $/)) {
      listValue.pop();
    }

    const parsedValue = valueToString(listValue);
    this.setState({ value: parsedValue });
    onChange(listValue.map(val => val.trim()));
  };

  handleFocus = () => {
    this.props.setActiveStyle();
  }

  handleBlur = (e) => {
    const listValue = e.target.value.split(',').map(el => el.trim()).filter(el => el);
    this.setState({ value: valueToString(listValue) });
    this.props.setInactiveStyle();
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { value, onChange } = this.props;
    const parsedValue = (this.valueType === valueTypes.SINGLE) ? null : Map();
    this.setState({ 
      listCollapsed: false,
      allItemsCollapsed: false,
    });
    onChange((value || List()).push(parsedValue));
  };

  /**
   * In case the `onChangeObject` function is frozen by a child widget implementation,
   * e.g. when debounced, always get the latest object value instead of using
   * `this.props.value` directly.
   */
  getObjectValue = idx => this.props.value.get(idx) || Map();

  handleChangeFor(index) {
    return (fieldName, newValue, newMetadata) => {
      const { value, metadata, onChange, forID } = this.props;
      const newObjectValue = this.getObjectValue(index).set(fieldName, newValue);
      const parsedValue = (this.valueType === valueTypes.SINGLE) ? newObjectValue.first() : newObjectValue;
      const parsedMetadata = {
        [forID]: Object.assign(metadata ? metadata.toJS() : {}, newMetadata ? newMetadata[forID] : {}),
      };
      onChange(value.set(index, parsedValue), parsedMetadata);
    };
  }

  handleRemove = (index, event) => {
    event.preventDefault();
    const { itemsCollapsed } = this.state;
    const { value, metadata, onChange, forID } = this.props;
    const parsedMetadata = metadata && { [forID]: metadata.removeIn(value.get(index).valueSeq()) };
    
    this.setState({
      itemsCollapsed: itemsCollapsed.delete(index),
    });
    onChange(value.remove(index), parsedMetadata);
  }

  handleCollapseToggle = () => {
    this.setState({ listCollapsed: !this.state.listCollapsed });
  }

  handleItemCollapseToggle = (index, event) => {
    event.preventDefault();
    const { value } = this.props;
    let { itemsCollapsed } = this.state;

    itemsCollapsed = itemsCollapsed.set(index, !itemsCollapsed.get(index, false));
    const allCollapsed = itemsCollapsed.every((collapsed, i) => collapsed);

    this.setState({
      itemsCollapsed,
      allItemsCollapsed: itemsCollapsed.size === value.size && allCollapsed,
    });
  }

  handleCollapseAllToggle = (e) => {
    e.preventDefault();
    const { allItemsCollapsed } = this.state;
    const { value } = this.props;
    const itemsCount = value ? value.size : 0;
    let { itemsCollapsed } = this.state;

    for (let i = 0; i < itemsCount; i++) {
      itemsCollapsed = itemsCollapsed.set(i, !allItemsCollapsed);
    }

    this.setState({
      itemsCollapsed,
      allItemsCollapsed: !allItemsCollapsed,
    });
  }

  objectLabel(item) {
    const { field } = this.props;
    const multiFields = field.get('fields');
    const singleField = field.get('field');
    const labelField = (multiFields && multiFields.first()) || singleField;
    const value = multiFields ? item.get(multiFields.first().get('name')) : singleField.get('label');
    return value || `No ${ labelField.get('name') }`;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { value, onChange } = this.props;

    // Update value
    const item = value.get(oldIndex);
    const newValue = value.delete(oldIndex).insert(newIndex, item);
    this.props.onChange(newValue);

    // Update collapsing
    const { itemsCollapsed } = this.state;
    const collapsed = itemsCollapsed.get(oldIndex);
    const newItemsCollapsed = itemsCollapsed.delete(oldIndex).insert(newIndex, collapsed);
    this.setState({ itemsCollapsed: newItemsCollapsed });
  };

  renderItem = (item, index) => {
    const {
      field,
      getAsset,
      mediaPaths,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      classNameWrapper,
    } = this.props;
    const { itemsCollapsed } = this.state;
    const collapsed = itemsCollapsed.get(index);
    const classNames = ['nc-listControl-item', collapsed ? 'nc-listControl-collapsed' : ''];

    return (<SortableListItem className={classNames.join(' ')} index={index} key={`item-${ index }`}>
      <ListItemTopBar
        className="nc-listControl-itemTopBar"
        collapsed={collapsed}
        onCollapseToggle={partial(this.handleItemCollapseToggle, index)}
        onRemove={partial(this.handleRemove, index)}
        dragHandleHOC={SortableHandle}
      />
      <div className="nc-listControl-objectLabel">{this.objectLabel(item)}</div>
      <ObjectControl
        value={item}
        field={field}
        onChangeObject={this.handleChangeFor(index)}
        getAsset={getAsset}
        onOpenMediaLibrary={onOpenMediaLibrary}
        mediaPaths={mediaPaths}
        onAddAsset={onAddAsset}
        onRemoveInsertedMedia={onRemoveInsertedMedia}
        classNameWrapper={`${classNameWrapper} nc-listControl-objectControl`}
      />
    </SortableListItem>);
  };

  renderListControl() {
    const { value, forID, field, classNameWrapper } = this.props;
    const { listCollapsed } = this.state;
    const items = value || List();
    const className = c(classNameWrapper, 'nc-listControl', {
      'nc-listControl-collapsed' : listCollapsed,
    });

    return (
      <div id={forID} className={className}>
        <TopBar
          onAdd={this.handleAdd}
          listLabel={field.get('label').toLowerCase()}
          onCollapseToggle={this.handleCollapseToggle}
          onCollapseAllToggle={this.handleCollapseAllToggle}
          allItemsCollapsed={this.state.allItemsCollapsed}
          listCollapsed={listCollapsed}
          itemsCount={items.size}
        />
        {
          listCollapsed ? null :
            <SortableList
              items={items}
              renderItem={this.renderItem}
              onSortEnd={this.onSortEnd}
              useDragHandle
              lockAxis="y"
            />
        }
      </div>
    );
  }

  render() {
    const { field, forID, classNameWrapper } = this.props;
    const { value } = this.state;

    if (field.get('field') || field.get('fields')) {
      return this.renderListControl();
    }

    return (<input
      type="text"
      id={forID}
      value={value}
      onChange={this.handleChange}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      className={classNameWrapper}
    />);
  }
};
