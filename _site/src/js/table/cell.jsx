var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Dropdown = require('./dropdown.jsx');
var FeatureComponent = require('../features/featureComponent.jsx');
var FilterDropdown = require('./filterDropdown.jsx');
var PageLoading = require('./pageLoading.jsx');
var Info = require('./Info.jsx');
var Column = require('./column.jsx');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Pretty = FeatureComponent.Pretty;
// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// **Cell** defines the properties of each cell in the
// data table.
var Cell = React.createClass({
    copyId: function() {
        var range = document.createRange();
        var selection = window.getSelection();
        range.selectNodeContents(document.getElementById(this.props.unique));
        selection.removeAllRanges();
        selection.addRange(range);
        $('#copyId').val(this.props._type + '/' + this.props._id).select();
        document.execCommand("copy");
    },
    selectRecord: function(ele) {
        _id = this.props._id;
        _type = this.props._type;
        row = this.props.row;
        this.props.actionOnRecord.selectRecord(_id, _type, row, ele.currentTarget.checked);
    },
    render: function() {
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        var actionOnRecord = this.props.actionOnRecord;

        // exposing visibility property allows us to show / hide
        // individual cells
        var vb = this.props.visibility;
        style = {
            display: vb
        };
        data = this.props.item;
        // The id of the html element is generated
        // in keys.js.
        _id = this.props._id;
        _type = this.props._type;
        to_display = data;
        tdClass = 'column_width columnAdjust';

        var columnName = this.props.columnName;
        var radioId = this.props.unique + 'radio';
        // cell-data of format ``string`` and ``number`` is rendered inline.
        // If a field is a JSON object instead, it's displayed as a modal pop-up.
        // <a href="#"
        //                         onClick={showJSON.bind(null, data, _type, _id)}>
        //                         <i className="fa fa-external-link" />
        //                     </a>;
        var appIdClass = "appId";
        actionOnRecord.selectedRows.forEach(function(v){
            if (v._id == _id)
                appIdClass += " showRow";
        });
        if (columnName == 'json') {
            prettyData = <Pretty json={data} />
            to_display = <div className={appIdClass}>
                            <span className="theme-element selectrow checkbox">
                                <input onChange={this.selectRecord} className="rowSelectionCheckbox" type="checkbox" name="selectRecord"
                                 value={_id} data-type={_type} id={radioId} />
                                <label htmlFor={radioId}></label>
                            </span>
                            <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
                                <a href="javascript:void(0);" className="appId_icon bracketIcon"></a>
                            </OverlayTrigger>
                            <span className="appId_name" onClick={this.copyId}>
                                <span className="appId_appname" title={_type}>{_type}&nbsp;/&nbsp;</span>
                                <span className="appId_id" title={_id}>{_id}</span>
                            </span>
                        </div>;
            tdClass = 'column_width';
        } else {
            if (typeof data !== 'string') {
                if (typeof data !== 'number') {
                    prettyData = <Pretty json={data} />
                    to_display = <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
                                    <a href="javascript:void(0);"  className="bracketIcon">
                                    </a>
                                </OverlayTrigger>
                    tdClass = 'column_width';
                }
            }
        }
        return <td
                 width={cellWidth}
                id={this.props.unique}
                key={this.props.unique}
                style={style}
                className={tdClass}>
                    {to_display}
                </td>;
    }
});

module.exports = Cell;