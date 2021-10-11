
# IMPORT STANDARD LIBRARIES
import json

# IMPORT THIRD PARTY LIBRARIES
import flask

# IMPORT LOCAL LIBRARIES
from lorgs import data
from lorgs.cache import cache
from lorgs.models import warcraftlogs_comp_ranking
from lorgs.routes import api_tasks


blueprint = flask.Blueprint("api.comp_rankings", __name__)


@blueprint.route("/comp_ranking/<string:boss_slug>")
@cache.cached(query_string=True)
def get_comp_ranking(boss_slug):
    """Fetch comp rankings for a given boss encounter.

    Args:
        boss_slug (str): name of the boss (full_name_slug)

    Query Params:
        limit (int): max number of fights to fetch (default: 20)
        role (list[str]): role filters
        spec (list[str]): spec filters
        class (list[str]): class filters

    Returns:
        dict:
            fights (list[dict]):
            updated

    """
    limit = flask.request.args.get("limit", default=20, type=int)

    # get search inputs
    search = {}
    search["fights.composition.roles"] = flask.request.args.getlist("role")
    search["fights.composition.specs"] = flask.request.args.getlist("spec")
    search["fights.composition.classes"] = flask.request.args.getlist("class")

    # lookup DB
    comp_ranking = warcraftlogs_comp_ranking.CompRanking(boss_slug=boss_slug)
    if not comp_ranking.valid:
        return "Invalid Boss.", 404

    reports = comp_ranking.get_reports(limit=limit, search=search)

    # return
    return {
        "fights": [report.fight.as_dict() for report in reports if report.fight],
        "updated": comp_ranking.updated,
    }


@blueprint.route("/load_comp_ranking/<string:boss_slug>")
async def load_comp_ranking(boss_slug):
    """Load Comp Rankings from Warcraftlogs and save them in our DB.

    Args:
        boss_slug (str): name of the boss (full_name_slug)

    Query Parms:
        limit (int): maximum number of fights to fetch (default: 100)
        clear (bool): delete old fights (default: false)

    """
    # inputs
    limit = flask.request.args.get("limit", default=50, type=int)
    clear = flask.request.args.get("clear", default=False, type=json.loads)

    # get comp ranking object
    comp_ranking = warcraftlogs_comp_ranking.CompRanking(boss_slug=boss_slug)
    if not comp_ranking.valid:
        return "Invalid Boss.", 404

    # update
    await comp_ranking.update_reports(limit=limit, clear_old=clear)
    comp_ranking.save()

    return "done"


################################################################################
# Tasks
#

@blueprint.route("/task/load_comp_ranking")
@blueprint.route("/task/load_comp_ranking/all")
@blueprint.route("/task/load_comp_ranking/<string:boss_slug>")
def task_load_comp_rankings(boss_slug=""):

    bosses = [boss_slug] if boss_slug else [boss.full_name_slug for boss in data.SANCTUM_OF_DOMINATION_BOSSES]

    for boss_slug in bosses:
        url = f"/api/load_comp_ranking/{boss_slug}"
        api_tasks.create_task(url)
    return f"{len(bosses)} tasks queued"
