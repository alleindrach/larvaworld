
import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  ListView,
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native'
import PropTypes from 'prop-types';

export default class BaseListView extends Component {
  static defaultProps = {
    autoFetch: false,
    footerText: {
      empty: '未获取到数据',
      full: '没有更多数据了'
    }
  };

  static propTypes = {
    style: ListView.propTypes.style,
    renderHeader: PropTypes.func,
    renderRow: PropTypes.func.isRequired,
    renderFooter: PropTypes.func,
    autoFetch: PropTypes.bool,
    listData: PropTypes.shape({
      hasMore: PropTypes.bool,
      data: PropTypes.array,
      action: PropTypes.string,
    }).isRequired,
    onRefresh: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    footerText: PropTypes.shape({
      empty: PropTypes.string,
      full: PropTypes.string,
    })
  };

  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    const {data = []} = this.props.listData;
    this.state = {
      dataSource: ds.cloneWithRows(data)
    };
  }

  componentDidMount() {
    this.props.autoFetch && this.props.onRefresh()
  }

  componentWillReceiveProps(nextProps) {
    const {data = []} = nextProps.listData
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })
  }

  _refresh = () => {
    //空闲状态 没有正在触发的action
    if (!this.props.listData.action) {
      this.props.onRefresh()
    }
  }

  _loadMore = () => {
    //空闲状态 且 还有数据可取
    if (!this.props.listData.action && this.props.listData.hasMore) {
      this.props.onLoadMore()
    }
  }

  scrollTo = (...args) => {
    this.refs['list'] && this.refs['list'].scrollTo(...args)
  }

  _renderFooter = () => {
    const {data, hasMore, action} = this.props.listData
    if (!data.length) {
      return (
        <View style={{marginTop: em(200), alignItems: 'center', flexDirection: 'column'}}>
          <Image source={require('../assets/activity/icon_tip.png')}/>
          <Text style={{color: '#999', marginTop: em(20)}}>{this.props.footerText.empty}</Text>
        </View>
      )
    }
    if (!hasMore) {
      return (
        <View style={{
          alignItems: 'center',
          paddingVertical: 10,
          marginBottom: 10
        }}>
          <Text>{this.props.footerText.full}</Text>
        </View>
      )
    }
    if (action === 'more') {
      return (
        <ActivityIndicator/>
      )
    }
    return (
      <View/>
    )
  };

  render() {
    const {style, renderHeader, renderRow, renderFooter, listData} = this.props;
    return (
      <ListView
        ref="list"
        style={style}
        dataSource={this.state.dataSource}
        onEndReached={this._loadMore}
        iosautomaticallyAdjustContentInsets={false}
        onendreachedthreshold={20}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderFooter={renderFooter || this._renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={listData.action === 'refresh'}
            onRefresh={this._refresh}
            // progressViewOffset={5}
            //ios
            tintColor="#ccc"
            title={this.props.listData.action === 'refresh' ? '正在刷新' : '下拉刷新'}
            titleColor="#ccc"
            //android
            colors={['#00aaff', '#ff00aa', '#aaff00']}
            progressBackgroundColor="rgb(248,248,248)"/>
        }
        enableEmptySections={true}
      />
    )
  }
}