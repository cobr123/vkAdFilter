//var avBadId = [];
var svUserLinkClass = "mem_link";
//var svPatt = /id\d+/i;
var svPatt = /\/\w+$/i;
if (localStorage['gbFilter'] == null)
{
  localStorage['gbFilter'] = 1;
}
var gbFilter = localStorage['gbFilter'];

var ovSummary = document.getElementById("summary");
// новый элемент
var ovNewDiv = document.createElement('div');
ovNewDiv.innerHTML = 'Фильтр пользователей ';
ovNewDiv.id = 'mysummary';
ovSummary.appendChild(ovNewDiv);
// новый элемент
var ovNewOnOff = document.createElement('a');
if (gbFilter == 0)
{
  ovNewOnOff.innerHTML = '<font color="#400000">выключен</font>'
}
else
{
  ovNewOnOff.innerHTML = '<font color="green">включен</font>'
}
ovNewOnOff.href = 'javascript:void(0)'
ovNewOnOff.id = 'SwitchFilterOnOff'
ovNewOnOff.onclick = SwitchFilter;
ovNewDiv.appendChild(ovNewOnOff);

/*
 * Включает \ выключает фильтрование объявлений
*/
function SwitchFilter()
{
  var ovSwitchFilterOnOff = document.getElementById("SwitchFilterOnOff");
  if (gbFilter == 0)
  {
    gbFilter = 1;
    localStorage['gbFilter'] = 1;
    ovSwitchFilterOnOff.innerHTML = '<font color="green">включен</font>'
  }
  else
  {
    gbFilter = 0;
    localStorage['gbFilter'] = 0;
    ovSwitchFilterOnOff.innerHTML = '<font color="#400000">выключен</font>'
  }
}
//localStorage['avBadId'] = '';
if (localStorage['avBadId'])
{
  //alert('localStorage finded');
  var avBadId = JSON.parse(localStorage['avBadId']);
}
else
{
  var avBadId = ['id138578019', 'id77707225', 'id43788170', 'id10973165', 'id48842540', 'id136356439', 'id138358135'];
  localStorage['avBadId'] = JSON.stringify(avBadId);
}
//alert(avBadId.length);
//alert(localStorage['avBadId'].length);
Array.prototype.inArray = function inArray(value)
// Returns true if the passed value is found in the
// array. Returns false if it is not.
{
  var i;
  for (i = 0; i < this.length; i++)
  {
    // Matches identical (===), not just similar (==).
    if (this[i] == value)
    {
      return true;
    }
  }
  return false;
}
/*
 * Удаляет элемент массива по порядковому номеру
*/
function removeByElement(apArr, spElem)
{
  for (var i = 0; i < apArr.length; i++)
  {
    if (apArr[i] == spElem)
    {
      apArr.splice(i, 1);
    }
  }
  return apArr;
}

/*
 * Удаляет id из списка плохих id
*/
function PopBadUid()
{
  document.body.removeEventListener('DOMNodeInserted', newElementHook, false);
  var ovFilterButton = GetFilterButton(this);
  var avElem = this.parentNode.childNodes;
  for (var i = 0;
  (element = avElem[i]) != null; i++)
  {
    if (element.className == svUserLinkClass)
    {
      avBadId = removeByElement(avBadId, String(element.href.match(svPatt)).substr(1));
      localStorage['avBadId'] = JSON.stringify(avBadId);
      break;
    }
  }
  ovFilterButton.innerHTML = 'Фильтровать'
  ovFilterButton.onclick = PushBadUid;
  document.body.addEventListener('DOMNodeInserted', newElementHook, false);
  return false;
}
/*
 * Добавляет новый id в список плохих id
*/
function PushBadUid()
{
  document.body.removeEventListener('DOMNodeInserted', newElementHook, false);
  var ovFilterButton = GetFilterButton(this);
  var avElem = this.parentNode.childNodes;
  for (var i = 0; (element = avElem[i]) != null; i++)
  {
    if (element.className == svUserLinkClass)
    {
      var svId = String(element.href.match(svPatt)).substr(1);
      if (svId)
      {
        if (avBadId.inArray(svId) != true)
        {
          avBadId.push(svId);
          localStorage['avBadId'] = JSON.stringify(avBadId);
          //alert(localStorage['avBadId']);
        }
        if (gbFilter == 1)
        {
          this.parentNode.parentNode.parentNode.parentNode.style.display = 'none !important';
        }
        ovFilterButton.innerHTML = '<font color="#400000">Не фильтровать</font>'
        ovFilterButton.onclick = PopBadUid;
        break;
      }
    }
  }
  document.body.addEventListener('DOMNodeInserted', newElementHook, false);
  ApplyFilter();
  return false;
}

/*
 * Возвращает объект кнопки "фильтровать" или null
*/
function GetFilterButton(opElem)
{
  var ovFilterButton = null;
  var avElem = opElem.parentNode.childNodes;
  
  for (var i = 0; (element = avElem[i]) != null; i++)
  {
    if(element.id == "filter_" + opElem.parentNode.parentNode.parentNode.parentNode.id)
    {
      ovFilterButton = element;
      break;
    }
  }
  return ovFilterButton;
}

/*
 * Добавляет каждому объявлению кнопку "Фильтровать"
 */
function AddFilterButton(opElem, bpFlag)
{
  var ovFilterButton = GetFilterButton(opElem);
  if (ovFilterButton == null)
  {
    document.body.removeEventListener('DOMNodeInserted', newElementHook, false);

    // новый элемент
    var ovNew = document.createElement('a')
    ovNew.href = 'javascript:void(0)'
    if (bpFlag)
    {
      ovNew.innerHTML = 'Фильтровать'
      ovNew.onclick = PushBadUid;
    }
    else
    {
      ovNew.innerHTML = '<font color="#400000">Не фильтровать</font>'
      ovNew.onclick = PopBadUid;
    }
    ovNew.id = "filter_" + opElem.parentNode.parentNode.parentNode.parentNode.id;
    // добавление в конец
    opElem.parentNode.appendChild(ovNew)
    document.body.addEventListener('DOMNodeInserted', newElementHook, false);
  }
}
/*
 * Обработчик события добавления элемента в DOM
*/
function newElementHook(event)
{
  //event.target - новый элемент
  //делаем наши темные делишки:)
  ApplyFilter();
}

function ApplyFilter()
{
  var allElements = document.getElementsByTagName("a");

  //фильтрация по uid
  for (var i = 0; (element = allElements[i]) != null; i++)
  {
    if (element.className == svUserLinkClass)
    {
      var svHref = element.href;
      var svId = String(svHref.match(svPatt)).substr(1);
      //alert(svHref.match(svPatt))
      if (avBadId.inArray(svId))
      {
        if (gbFilter == 1)
        {
          //если фильтр включен, то прячем div
          // element . "category" . "info" . "clear_fix body" . "item29604565"
          element.parentNode.parentNode.parentNode.parentNode.style.display = 'none !important';
        }
        else
        {
          //если фильтр выключен, то добавляем кнопку "не фильтровать"
          AddFilterButton(element, false);
          // и показываем скрытые div`ы
          element.parentNode.parentNode.parentNode.parentNode.style.display = '';
        }
      }
      else
      {
        //если id не найден, то добавляем кнопку "фильтровать"
        AddFilterButton(element, true);
      }
    }
  }
  //фильтрация по регулярным выражениям
}
//пробуем вешать слушателя для BODY
try
{
  document.body.addEventListener('DOMNodeInserted', newElementHook, false);
}
catch (e)
{
  //не получилось
  alert('ex');
}