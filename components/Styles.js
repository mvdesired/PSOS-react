import { StyleSheet, Dimensions } from 'react-native';
win = Dimensions.get('window');
const MainStyles = StyleSheet.create({
    psosBtn:{
        paddingVertical:14,
        paddingHorizontal: 40,
        borderRadius: 35,
        backgroundColor:'#147dbf'
    },
    psosBtnText:{
        color:'#FFF',
        fontFamily:'AvenirLTStd-Medium',
        fontSize: 20,
    },
    psosBtnSm:{
        paddingVertical:8,
        paddingHorizontal: 30,
    },
    psosBtnXm:{
        paddingVertical:5,
        paddingHorizontal: 20,
    },
    psosBtnXsText:{
        fontSize: 15,
    },
    TInput:{
        flex:1,
        //textAlign:'left',
        paddingLeft: 10,
        paddingVertical:2,
        height:30,
        fontSize:14,
        borderRadius:8,
        fontFamily:'AvenirLTStd-Medium',
        borderColor:'#a1a1a1',
        borderWidth: 1,
        borderStyle:"dashed"
    },
    selectFilesBtn:{
        backgroundColor:'#959595',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical:5,
        borderRadius:35,
        borderColor:'#a1a1a1',
        borderWidth:1
    },
    col4:{
        width:'20%',
    },
    checkBoxWrapper:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    checkBoxStyle:{
        width:15,
        height:15,
        borderWidth:1,
        borderColor:'#bebebe',
        borderRadius:3,
        marginRight:6
    },
    checkBoxLabel:{
        color:'#676767',
        fontSize:13,
        fontFamily:'AvenirLTStd-Medium'
    },
    tacItems:{
        paddingVertical: 10,
        flexWrap:'wrap',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    tacItemsH:{
        fontFamily:'AvenirLTStd-Heavy',
        fontSize:15
    },
    tacItemsSH:{
        fontFamily:'AvenirLTStd-Roman',
        fontSize:13
    },
    tacItemsImage:{
        width:'100%',
        marginTop:10
    },
    modalHeader:{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#1476c0",
        paddingHorizontal:10
    },
    modalHeaderHeading:{
        color: "#FFF",
        fontFamily: "Roboto-Medium",
        fontSize: 16,
        paddingVertical:10,
        fontFamily:'AvenirLTStd-Medium',
    },
    modalFooter:{
        width:'100%',
        backgroundColor:'#ebebeb',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:5,
        borderTopColor: '#bebebe',
        borderTopWidth: 2,
    }
});
export default MainStyles;